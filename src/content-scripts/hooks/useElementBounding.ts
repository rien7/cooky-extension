import { useEffect, useState } from 'react'
import useMouseElement from './useMouseElement'

export default function useElementBounding(fixed: boolean = false) {
  const [elementBounding, setElementBounding] = useState<{ x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number; scrollX: number; scrollY: number } | undefined>(undefined)
  const element = useMouseElement()

  useEffect(() => {
    if (fixed)
      return
    const boundingClientRect = element?.getBoundingClientRect()
    if (!boundingClientRect) {
      setElementBounding(undefined)
      return
    }
    const { x, y, width, height, top, right, bottom, left } = boundingClientRect
    const { scrollX, scrollY } = window
    setElementBounding({ x, y, width, height, top, right, bottom, left, scrollX, scrollY })
  }, [element, fixed])

  return elementBounding
}
