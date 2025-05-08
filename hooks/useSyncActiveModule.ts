import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useNavigationStore } from '../store/navigationStore'

export const useSyncActiveModule = () => {
  const pathname = usePathname()
  const setActiveModule = useNavigationStore((s) => s.setActiveModule)

  useEffect(() => {
    if (pathname.includes('/events')) setActiveModule('events')
    else if (pathname.includes('/combos')) setActiveModule('combos')
    else if (pathname.includes('/orders')) setActiveModule('orders')
    else if (pathname.includes('/pagos')) setActiveModule('payments')
    else if (pathname.includes('/users')) setActiveModule('users')
    else if (pathname.includes('/settings')) setActiveModule('settings')
    else setActiveModule('')
  }, [pathname, setActiveModule])
}
