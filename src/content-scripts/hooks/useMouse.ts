import { useEffect, useState } from 'react'

export interface CursorState {
  screenX: number
  screenY: number
  clientX: number
  clientY: number
  pageX: number
  pageY: number
}

export default function useMouse() {
  const [position, setPosition] = useState<CursorState | undefined>(undefined)
  function handleMouseMove(event: MouseEvent) {
    const { screenX, screenY, clientX, clientY, pageX, pageY } = event
    setPosition({ screenX, screenY, clientX, clientY, pageX, pageY })
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return position
}
