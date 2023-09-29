import { useEffect, useState } from 'react'

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

export default function useElementBounding(element: Element | undefined) {
  const [elementBounding, setElementBounding] = useState<ElementBoundingType | undefined>(undefined)

  useEffect(() => {
    if (!element) {
      setElementBounding(undefined)
      return
    }

    const boundingClientRect = element.getBoundingClientRect()
    if (!boundingClientRect) {
      setElementBounding(undefined)
      return
    }
    const { x, y, width, height, top, right, bottom, left } = boundingClientRect
    const { scrollX, scrollY } = window
    setElementBounding({ x, y, width, height, top, right, bottom, left, scrollX, scrollY })
  }, [element])

  return elementBounding
}
