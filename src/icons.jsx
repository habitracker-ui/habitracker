// Registro central de iconos usando Lucide React (SVG open source, estilo Flaticon)
// Importa solo los que necesitas para mantener el bundle pequeño.
import {
  CheckCircle2, BookOpen, Dumbbell, Droplets, Moon, Apple,
  Music, Activity, Brain, Coffee, PenLine, Target,
  Bike, Leaf, Pill, Heart, Flame, Star, Trophy, ShieldCheck,
  Sunrise, Wind, Utensils, Footprints, Glasses, Laptop,
  Zap, Timer, Bed, Sprout,
} from 'lucide-react'

export const HABIT_ICONS = [
  { key: 'check',    Icon: CheckCircle2, label: 'General'    },
  { key: 'book',     Icon: BookOpen,     label: 'Leer'       },
  { key: 'dumbbell', Icon: Dumbbell,     label: 'Ejercicio'  },
  { key: 'water',    Icon: Droplets,     label: 'Agua'       },
  { key: 'sleep',    Icon: Bed,          label: 'Dormir'     },
  { key: 'food',     Icon: Utensils,     label: 'Comer bien' },
  { key: 'music',    Icon: Music,        label: 'Música'     },
  { key: 'run',      Icon: Footprints,   label: 'Caminar'    },
  { key: 'activity', Icon: Activity,     label: 'Actividad'  },
  { key: 'mind',     Icon: Brain,        label: 'Meditación' },
  { key: 'coffee',   Icon: Coffee,       label: 'Café'       },
  { key: 'pen',      Icon: PenLine,      label: 'Escribir'   },
  { key: 'target',   Icon: Target,       label: 'Meta'       },
  { key: 'bike',     Icon: Bike,         label: 'Ciclismo'   },
  { key: 'leaf',     Icon: Sprout,       label: 'Crecer'     },
  { key: 'pill',     Icon: Pill,         label: 'Medicina'   },
  { key: 'heart',    Icon: Heart,        label: 'Salud'      },
  { key: 'flame',    Icon: Flame,        label: 'Motivación' },
  { key: 'star',     Icon: Star,         label: 'Logro'      },
  { key: 'trophy',   Icon: Trophy,       label: 'Premio'     },
  { key: 'shield',   Icon: ShieldCheck,  label: 'Hábito'     },
  { key: 'sun',      Icon: Sunrise,      label: 'Mañana'     },
  { key: 'wind',     Icon: Wind,         label: 'Respirar'   },
  { key: 'glasses',  Icon: Glasses,      label: 'Estudiar'   },
  { key: 'laptop',   Icon: Laptop,       label: 'Trabajar'   },
  { key: 'timer',    Icon: Timer,        label: 'Tiempo'     },
  { key: 'zap',      Icon: Zap,          label: 'Energía'    },
  { key: 'apple',    Icon: Apple,        label: 'Fruta'      },
]

/** Renderiza el componente Lucide para un key dado */
export function HabitIcon({ iconKey = 'check', size = 20, className = '' }) {
  const entry = HABIT_ICONS.find(i => i.key === iconKey) ?? HABIT_ICONS[0]
  const { Icon } = entry
  return <Icon size={size} className={className} strokeWidth={2} />
}
