import { useState, useRef } from 'react'
import { exportData, importData } from '../db'

export default function ImportExport({ onImported }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null) // null | 'ok' | 'error'
  const [msg, setMsg] = useState('')
  const fileRef = useRef()

  async function handleExport() {
    try {
      const json = await exportData()
      const blob = new Blob([json], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      const date = new Date().toISOString().slice(0, 10)
      a.href     = url
      a.download = `habitos-backup-${date}.json`
      a.click()
      URL.revokeObjectURL(url)
      setStatus('ok')
      setMsg('Backup exportado correctamente.')
    } catch {
      setStatus('error')
      setMsg('Error al exportar los datos.')
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      await importData(text)
      setStatus('ok')
      setMsg('Datos importados correctamente.')
      onImported?.()
    } catch (err) {
      setStatus('error')
      setMsg(`Error al importar: ${err.message}`)
    } finally {
      fileRef.current.value = ''
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        id="btn-import-export"
        onClick={() => setOpen(true)}
        className="text-xs text-ink/40 dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink transition-colors flex items-center gap-1"
      >
        ↕ Importar / Exportar
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-paper dark:bg-dark-card border border-line dark:border-dark-border shadow-2xl p-6 animate-fade-in">
            <h2 className="font-serif text-xl text-ink dark:text-dark-ink mb-1">Importar / Exportar</h2>
            <p className="text-xs text-ink/50 dark:text-dark-muted mb-5">
              Exporta tus hábitos y entradas como un archivo JSON para hacer respaldo o mover tus datos a otro dispositivo.
            </p>

            {status && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${status === 'ok' ? 'bg-moss/10 text-moss' : 'bg-clay/10 text-clay'}`}>
                {status === 'ok' ? '✅' : '❌'} {msg}
              </div>
            )}

            <div className="space-y-3">
              {/* Export */}
              <button
                id="btn-export-json"
                onClick={handleExport}
                className="w-full py-3 rounded-xl gradient-moss text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                ⬇ Exportar JSON
              </button>

              {/* Import */}
              <label
                htmlFor="file-import"
                className="w-full py-3 rounded-xl border-2 border-dashed border-line dark:border-dark-border text-ink/60 dark:text-dark-muted hover:border-moss dark:hover:border-moss hover:text-ink dark:hover:text-dark-ink font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                ⬆ Importar JSON
              </label>
              <input
                id="file-import"
                ref={fileRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="sr-only"
              />

              <p className="text-[10px] text-ink/35 dark:text-dark-muted text-center">
                ⚠ Al importar se reemplazarán TODOS los datos actuales.
              </p>
            </div>

            <button
              onClick={() => { setOpen(false); setStatus(null) }}
              className="mt-5 w-full py-2.5 rounded-xl border border-line dark:border-dark-border text-ink/60 dark:text-dark-muted text-sm hover:text-ink dark:hover:text-dark-ink transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
