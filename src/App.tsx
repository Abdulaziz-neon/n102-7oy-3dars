import { useState } from 'react'
import './index.css'
import NavItem from './components/NavItem.tsx'
import HomePage from './pages/HomePage.tsx'
import ProductsPage from './pages/ProductsPage.tsx'
import CategoryPage from './pages/CategoryPage.tsx'
import AuthPage from './pages/AuthPage.tsx'

type PageKey = 'home' | 'products' | 'category'

type AuthInfo = {
  token: string
  email: string
} | null

const pageTitleMap: Record<PageKey, string> = {
  home: 'Home',
  products: 'Products',
  category: 'Category',
}

function App() {
  const [auth, setAuth] = useState<AuthInfo>(() => {
    const token = window.localStorage.getItem('auth_token')
    const email = window.localStorage.getItem('auth_email')
    return token ? { token, email: email ?? '' } : null
  })
  const [activePage, setActivePage] = useState<PageKey>('home')

  const isAuthenticated = auth !== null

  const handleAuthSuccess = (payload: { token: string; email: string }) => {
    window.localStorage.setItem('auth_token', payload.token)
    window.localStorage.setItem('auth_email', payload.email)
    setAuth({ token: payload.token, email: payload.email })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('auth_token')
    window.localStorage.removeItem('auth_email')
    setAuth(null)
    setActivePage('home')
  }

  const renderPage = () => {
    switch (activePage) {
      case 'products':
        return <ProductsPage />
      case 'category':
        return <CategoryPage />
      case 'home':
      default:
        return <HomePage />
    }
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  const title = pageTitleMap[activePage]

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="w-64 bg-linear-to-b from-slate-950 to-slate-900 border-r border-slate-800 px-6 py-7 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-linear-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-xl font-bold">
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-slate-300">
              Admin Panel
            </span>
            <span className="text-xs text-slate-500">Dashboard</span>
          </div>
        </div>

        <div className="text-[11px] tracking-[0.2em] text-slate-500 uppercase">
          Menu
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem
            label="Home"
            active={activePage === 'home'}
            onClick={() => setActivePage('home')}
          />
          <NavItem
            label="Products"
            active={activePage === 'products'}
            onClick={() => setActivePage('products')}
          />
          <NavItem
            label="Category"
            active={activePage === 'category'}
            onClick={() => setActivePage('category')}
          />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col bg-slate-900/40">
        <header className="flex items-center justify-between px-10 py-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActivePage('home')}
              className="h-9 w-9 rounded-2xl bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:brightness-110 transition"
              aria-label="Back to home"
            >
              <span className="-ml-0.5 text-lg"><i className="fa-solid fa-angle-left"></i></span>
            </button>
            <h1 className="text-lg font-semibold tracking-wide">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-xs mr-1">
              <span className="text-slate-300 font-medium">
                {auth?.email || 'Foydalanuvchi'}
              </span>
              <span className="text-slate-500">Online</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-sm font-medium shadow-lg shadow-indigo-500/30 hover:brightness-110 transition"
            >
              Log out
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 px-10 py-6">{renderPage()}</main>
      </div>
    </div>
  )
}

export default App
