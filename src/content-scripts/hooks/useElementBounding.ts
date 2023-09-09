import { useEffect, useState } from 'react'
import useMouseElement from './useMouseElement'

export interface ElementBoundingType {
  x: number
  y: number
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
  scrollX: number
  scrollY: number
}

export default function useElementBounding(fixed: boolean = false, _element?: HTMLElement) {
  const [elementBounding, setElementBounding] = useState<ElementBoundingType | undefined>(undefined)
  let element = useMouseElement()
  if (_element)
    element = _element

  useEffect(() => {
    if (fixed && !_element)
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
