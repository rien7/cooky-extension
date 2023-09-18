import { useEffect, useState } from 'react'
import type { CursorState } from './useMouse'

export default function useMouseElement(fixed: boolean, keyPress: boolean, position: CursorState | undefined) {
  const [element, setElement] = useState<Element | undefined>(undefined)
  const excludeTagName = ['', 'HTML', 'BODY']
  const needMoreCheckTagName = ['DIV']
  const includeTagName = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'LI', 'DD', 'DT', 'TD']
  const inlineTagName = ['SPAN', 'CODE', 'B', 'I', 'EM', 'STRONG', 'A', '#text']

  useEffect(() => {
    if (!fixed && !keyPress) {
      setElement(undefined)
      return
    }

    if (fixed)
      return
    let element = document.elementFromPoint(position?.clientX ?? 0, position?.clientY ?? 0) || undefined

    if (!element || excludeTagName.includes(element.tagName || ''))
      return

    while (!includeTagName.includes(element?.tagName || '')) {
      if (needMoreCheckTagName.includes(element.tagName) && element.children.length === 0) {
        setElement(element)
        return
      }
      if (inlineTagName.includes(element?.tagName || '') && element.parentElement && needMoreCheckTagName.includes(element.parentElement.tagName)) {
        element = element.parentElement
        setElement(element)
        return
      }
      if (element.parentElement)
        element = element.parentElement
      else
        break
    }

    if (!element || element == null || excludeTagName.includes(element.tagName || '') || element.textContent?.trim() === '')
      return

    setElement(element)
  }, [position])

  return element
}
