import { useEffect, useState } from 'react'
import useMouse from './useMouse'

export default function useMouseElement(fixed: boolean = false) {
  const [element, setElement] = useState<Element | undefined>(undefined)
  const position = useMouse()
  const excludeTagName = ['', 'DIV', 'HTML', 'BODY']
  const includeTagName = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'LI', 'DD', 'DT']

  useEffect(() => {
    if (fixed)
      return
    let element = document.elementFromPoint(position?.clientX ?? 0, position?.clientY ?? 0) || undefined
    if (!element || element == null || excludeTagName.includes(element.tagName || '')) {
      // setElement(undefined)
      return
    }
    while (!includeTagName.includes(element?.tagName || '')) {
      if (element.parentElement)
        element = element.parentElement
      else
        break
    }
    if (!element || element == null || excludeTagName.includes(element.tagName || '')) {
      // setElement(undefined)
      return
    }
    setElement(element)
  }, [position])

  return element
}
