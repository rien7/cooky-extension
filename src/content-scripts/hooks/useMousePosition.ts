import { useEffect, useState } from 'react'

export interface CursorState {
  screenX: number
  screenY: number
  clientX: number
  clientY: number
  pageX: number
  pageY: number
}

/**
 * Return the position of the mouse when flag is true
 *
 * position will be `undefined` when flag is `false`
 * @param flag add/remove event listener
 * @returns position
 */
export default function useMousePosition(flag: boolean) {
  const [position, setPosition] = useState<CursorState | undefined>(undefined)
  function handleMouseMove(event: MouseEvent) {
    const { screenX, screenY, clientX, clientY, pageX, pageY } = event
    setPosition({ screenX, screenY, clientX, clientY, pageX, pageY })
  }

  useEffect(() => {
    if (flag) {
      document.addEventListener('mousemove', handleMouseMove)
    }
    else {
      document.removeEventListener('mousemove', handleMouseMove)
      setPosition(undefined)
    }
  }, [flag])

  return position
}
