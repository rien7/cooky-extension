import { useEffect, useState } from 'react'
import useMouseElement from './useMouseElement'

export default function useFloatDotPosition(fixed: boolean = false) {
  const [floatDotPosition, setFloatDotPosition] = useState<{ x: number; y: number } | undefined>(undefined)
  const element = useMouseElement()

  useEffect(() => {
    if (fixed)
      return
    const boundingClientRect = element?.getBoundingClientRect()
    if (!boundingClientRect) {
      setFloatDotPosition(undefined)
      return
    }
    const x = boundingClientRect.right + window.scrollX
    const y = boundingClientRect.bottom + window.scrollY
    setFloatDotPosition({ x, y })
  }, [element, fixed])

  return floatDotPosition
}
