type NavItemProps = {
  label: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ label, active, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm transition-colors duration-150',
        active
          ? 'bg-white/10 text-slate-50 shadow-sm shadow-indigo-500/40'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
      ].join(' ')}
    >
      <span
        className={[
          'h-2 w-2 rounded-full',
          active ? 'bg-indigo-400' : 'bg-slate-600',
        ].join(' ')}
      />
      <span>{label}</span>
    </button>
  )
}

export default NavItem
 
