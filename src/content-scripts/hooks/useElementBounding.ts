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

export default function useElementBounding(fixed: boolean, keyPress: boolean, element: Element) {
  const [elementBounding, setElementBounding] = useState<ElementBoundingType | undefined>(undefined)

  useEffect(() => {
    if (!fixed && !keyPress) {
      setElementBounding(undefined)
      return
    }
    // if selecting, then don't update bounding
    if (fixed)
      return
    const boundingClientRect = element.getBoundingClientRect()
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
