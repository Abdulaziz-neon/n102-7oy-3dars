import type { FormEvent } from 'react'
import { useState } from 'react'

type AuthMode = 'login' | 'register'

type AuthPageProps = {
  onAuthSuccess: (payload: { token: string; email: string }) => void
}

type RemoteUser = {
  id: number
  email: string
  password?: string
  name?: string
  avatar?: string
}

const USERS_API = 'https://api.escuelajs.co/api/v1/users'

function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setStatus(null)

    if (!email.trim() || !password.trim()) {
      setError("Email va parol to'ldirilishi shart.")
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        // LOGIN: API-dan foydalanuvchilar ro'yxatini olib, email (va mumkin bo'lsa parol) bo'yicha tekshiramiz
        const response = await fetch(USERS_API)

        if (!response.ok) {
          throw new Error('Foydalanuvchilar ro\'yxatini olishda xatolik yuz berdi.')
        }

        const users = (await response.json()) as RemoteUser[]

        const user = users.find((u) => {
          const sameEmail =
            u.email?.toLowerCase().trim() === email.toLowerCase().trim()
          // Baʼzi foydalanuvchilarda parol bo'lmasligi mumkin, shuning uchun mavjud bo'lsa solishtiramiz
          const passwordMatches = u.password ? u.password === password : true
          return sameEmail && passwordMatches
        })

        if (!user) {
          throw new Error("Email yoki parol noto'g'ri.")
        }

        const token = String(user.id)
        onAuthSuccess({ token, email: user.email })
      } else {
        // REGISTER: yangi foydalanuvchini shu API orqali yaratamiz
        const payload = {
          name: fullName || 'Yangi foydalanuvchi',
          email,
          password,
          avatar:
            'https://api.lorem.space/image/face?w=128&h=128',
        }

        const response = await fetch(USERS_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error("Ro'yxatdan o'tishda xatolik yuz berdi.")
        }

        // ignore response payload
        await response.json()

        // Ro'yxatdan o'tgandan so'ng avtomatik kirish emas,
        // foydalanuvchini login bo'limiga qaytaramiz.
        setMode('login')
        setPassword('')
        setStatus(
          "Muvaffaqiyatli ro'yxatdan o'tdingiz. Endi email va parolingiz bilan kirishingiz mumkin.",
        )
        setError(null)
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : mode === 'login'
            ? 'Kirishda xatolik yuz berdi.'
            : "Ro'yxatdan o'tishda xatolik yuz berdi."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const title = mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"
  const subtitle =
    mode === 'login'
      ? 'Admin panelga kirish uchun profilingizga kiring.'
      : 'Yangi akkaunt yarating va admin panelga kiring.'

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4 py-8">
      {/* Auth card only */}
      <div className="relative max-w-md w-full">
        <div className="absolute -top-10 right-10 h-32 w-32 rounded-full bg-indigo-500/40 blur-3xl" />

        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-2xl shadow-black/40 backdrop-blur-2xl px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">{subtitle}</p>
              </div>

              <div className="hidden sm:flex text-[11px] rounded-full border border-slate-700 bg-slate-900/40 p-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={[
                    'px-3 py-1.5 rounded-full transition text-[11px]',
                    mode === 'login'
                    ? 'bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-100',
                  ].join(' ')}
                >
                  Kirish
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={[
                    'px-3 py-1.5 rounded-full transition text-[11px]',
                    mode === 'register'
                      ? 'bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-100',
                  ].join(' ')}
                >
                  Ro&apos;yxatdan o&apos;tish
                </button>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Ism familiya</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Ali Valiyev"
                    className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Parol</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-4 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}

              {status && !error && (
                <div className="rounded-2xl border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200">
                  {status}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-tr from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading
                  ? mode === 'login'
                    ? 'Kirilmoqda...'
                    : "Jo'natilmoqda..."
                  : mode === 'login'
                    ? 'Kirish'
                    : "Ro'yxatdan o'tish"}
              </button>
            </form>
          </div>
        </div>
      </div>
    
  )
}

export default AuthPage

