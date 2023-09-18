import { useEffect, useState } from 'react'
import type { CursorState } from './useMouse'

export default function useMouseElement(fixed: boolean, keyPress: boolean, position: CursorState | undefined) {
  const [element, setElement] = useState<Element | undefined>(undefined)
  const excludeTagName = ['', 'HTML', 'BODY']
  const needMoreCheckTagName = ['DIV']
  const notBeChildTagName = ['PRE', 'BUTTON']
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

    if (!element || excludeTagName.includes(element.tagName || '') || element.textContent?.trim() === '')
      return

    let tobeSetElement: Element | undefined
    while (!includeTagName.includes(element?.tagName || '')) {
      if (needMoreCheckTagName.includes(element.tagName)) {
        if (element.children.length === 0) {
          tobeSetElement = element
          break
        }
        else {
          let canSet = true
          const children = element.children
          for (let i = 0; i < children.length; i++) {
            if (!inlineTagName.includes(children[i].tagName)) {
              canSet = false
              break
            }
          }
          if (canSet) {
            tobeSetElement = element
            break
          }
        }
      }
      if (inlineTagName.includes(element?.tagName || '') && element.parentElement && needMoreCheckTagName.includes(element.parentElement.tagName)) {
        element = element.parentElement
        tobeSetElement = element
        break
      }
      if (element.parentElement)
        element = element.parentElement
      else
        break
    }

    if (!tobeSetElement
      && (!element || element == null || excludeTagName.includes(element.tagName || '') || element.textContent?.trim() === ''))
      return

    if (tobeSetElement) {
      let checkElement: Element | undefined = tobeSetElement
      while (!excludeTagName.includes(checkElement?.tagName || '')) {
        if (notBeChildTagName.includes(checkElement?.tagName || '')) {
          tobeSetElement = undefined
          return
        }
        checkElement = checkElement?.parentElement || undefined
      }
    }

    setElement(tobeSetElement || element)
  }, [position])

  return element
}
