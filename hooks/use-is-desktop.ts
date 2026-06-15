'use client'

import { useEffect, useState } from 'react'

/** `true` when viewport is at least `minWidth` (default 768px / Tailwind `md`). */
export function useIsDesktop(minWidth = 768): boolean {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [minWidth])

  return isDesktop
}
