import Dexie from 'dexie'

// Toda la información vive únicamente en el dispositivo del usuario,
// dentro de IndexedDB. No hay servidor ni sincronización.
export const db = new Dexie('habitTrackerDB')

// v1: habits básicos solo diarios
// v2: añade frequency, emoji, color; soft-delete con archivedAt
db.version(1).stores({
  habits: '++id, name, createdAt, archived',
  entries: '++id, habitId, date, done, [habitId+date]'
})

db.version(2).stores({
  habits: '++id, name, frequency, emoji, color, createdAt, archived',
  entries: '++id, habitId, date, done, [habitId+date]'
}).upgrade(tx => {
  // Migrar hábitos existentes: asignar frequency='daily' por defecto
  return tx.table('habits').toCollection().modify(habit => {
    if (!habit.frequency) habit.frequency = 'daily'
    if (!habit.emoji) habit.emoji = '✅'
    if (!habit.color) habit.color = 'moss'
  })
})

// ─── Utilidades de clave de fecha ───────────────────────────────────────────

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10) // YYYY-MM-DD
}

export function addDays(dateKey, days) {
  const d = new Date(dateKey + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return todayKey(d)
}

/** Retorna las claves de los últimos `n` días, de más antiguo a más reciente */
export function lastNDays(n, endDateKey = todayKey()) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    days.push(addDays(endDateKey, -i))
  }
  return days
}

/** YYYY-Www  (ISO week) */
export function weekKey(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

/** YYYY-MM */
export function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7)
}

/** Últimas `n` semanas en formato YYYY-Www */
export function lastNWeeks(n) {
  const keys = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    keys.push(weekKey(d))
  }
  return keys
}

/** Últimos `n` meses en formato YYYY-MM */
export function lastNMonths(n) {
  const keys = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(monthKey(d))
  }
  return keys
}

/** Label legible de semana: "S37" */
export function weekLabel(key) {
  return 'S' + key.split('-W')[1]
}

/** Label legible de mes: "Ene", "Feb", etc. */
export function monthLabel(key) {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleDateString('es-MX', { month: 'short' })
    .replace('.', '')
    .replace(/^\w/, c => c.toUpperCase())
}

// ─── CRUD de hábitos ─────────────────────────────────────────────────────────

export async function createHabit({ name, frequency = 'daily', emoji = '✅', color = 'moss' }) {
  return db.habits.add({ name, frequency, emoji, color, createdAt: new Date().toISOString(), archived: 0 })
}

/** Soft delete: marca como archivado pero NO elimina los datos */
export async function archiveHabit(id) {
  return db.habits.update(id, { archived: 1, archivedAt: new Date().toISOString() })
}

/** Restaurar hábito archivado */
export async function restoreHabit(id) {
  return db.habits.update(id, { archived: 0, archivedAt: null })
}

// ─── Toggle de entradas ───────────────────────────────────────────────────────

/**
 * Alterna el estado de una entrada.
 * `periodKey` puede ser: YYYY-MM-DD (daily), YYYY-Www (weekly), YYYY-MM (monthly)
 */
export async function toggleEntry(habitId, periodKey) {
  const existing = await db.entries.where({ habitId, date: periodKey }).first()
  if (existing) {
    return db.entries.update(existing.id, { done: existing.done ? 0 : 1 })
  }
  return db.entries.add({ habitId, date: periodKey, done: 1 })
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

/** Racha diaria: días consecutivos completados hasta hoy o ayer */
export function computeDailyStreak(entries) {
  const doneDates = new Set(entries.filter(e => e.done).map(e => e.date))
  let streak = 0
  let cursor = todayKey()
  if (!doneDates.has(cursor)) cursor = addDays(cursor, -1)
  while (doneDates.has(cursor)) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

/** Racha semanal: semanas consecutivas completadas hasta esta semana o la anterior */
export function computeWeeklyStreak(entries) {
  const doneWeeks = new Set(entries.filter(e => e.done).map(e => e.date))
  let streak = 0
  const now = new Date()
  let cursor = weekKey(now)
  if (!doneWeeks.has(cursor)) {
    const prev = new Date(now)
    prev.setDate(prev.getDate() - 7)
    cursor = weekKey(prev)
  }
  for (let i = 0; i < 104; i++) {
    if (doneWeeks.has(cursor)) {
      streak++
      const d = new Date()
      d.setDate(d.getDate() - (i + 1) * 7)
      cursor = weekKey(d)
    } else break
  }
  return streak
}

/** Racha mensual */
export function computeMonthlyStreak(entries) {
  const doneMonths = new Set(entries.filter(e => e.done).map(e => e.date))
  const now = new Date()
  let streak = 0
  let y = now.getFullYear()
  let m = now.getMonth() // 0-indexed

  let cursor = `${y}-${String(m + 1).padStart(2, '0')}`
  if (!doneMonths.has(cursor)) {
    m--
    if (m < 0) { m = 11; y-- }
    cursor = `${y}-${String(m + 1).padStart(2, '0')}`
  }

  for (let i = 0; i < 60; i++) {
    if (doneMonths.has(cursor)) {
      streak++
      m--
      if (m < 0) { m = 11; y-- }
      cursor = `${y}-${String(m + 1).padStart(2, '0')}`
    } else break
  }
  return streak
}

export function computeStreak(entries, frequency = 'daily') {
  if (frequency === 'weekly') return computeWeeklyStreak(entries)
  if (frequency === 'monthly') return computeMonthlyStreak(entries)
  return computeDailyStreak(entries)
}

// ─── XP / Gamificación ────────────────────────────────────────────────────────

export const XP_PER_COMPLETION = 10
export const XP_STREAK_BONUS = [0, 0, 5, 10, 15, 20, 30] // índice = días de racha (cap 6+)

export function xpForStreak(streak) {
  return XP_STREAK_BONUS[Math.min(streak, XP_STREAK_BONUS.length - 1)]
}

export const LEVELS = [
  { level: 1, name: 'Principiante', xpMin: 0,   xpMax: 100  },
  { level: 2, name: 'Aprendiz',     xpMin: 100,  xpMax: 250  },
  { level: 3, name: 'Constante',    xpMin: 250,  xpMax: 500  },
  { level: 4, name: 'Dedicado',     xpMin: 500,  xpMax: 900  },
  { level: 5, name: 'Experto',      xpMin: 900,  xpMax: 1500 },
  { level: 6, name: 'Maestro',      xpMin: 1500, xpMax: 2500 },
  { level: 7, name: 'Leyenda',      xpMin: 2500, xpMax: Infinity }
]

export function getLevelInfo(totalXP) {
  const lvl = LEVELS.findLast(l => totalXP >= l.xpMin) ?? LEVELS[0]
  const next = LEVELS.find(l => l.level === lvl.level + 1)
  const progress = next
    ? ((totalXP - lvl.xpMin) / (lvl.xpMax - lvl.xpMin)) * 100
    : 100
  return { ...lvl, totalXP, nextXP: lvl.xpMax, progress: Math.min(progress, 100) }
}

// ─── Import / Export JSON ─────────────────────────────────────────────────────

export async function exportData() {
  const habits = await db.habits.toArray()
  const entries = await db.entries.toArray()
  return JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), habits, entries }, null, 2)
}

export async function importData(jsonString) {
  const data = JSON.parse(jsonString)
  if (!data.habits || !data.entries) throw new Error('Formato inválido')

  await db.transaction('rw', db.habits, db.entries, async () => {
    // Limpiar datos actuales
    await db.habits.clear()
    await db.entries.clear()
    // Insertar los importados
    await db.habits.bulkAdd(data.habits)
    await db.entries.bulkAdd(data.entries)
  })
}
