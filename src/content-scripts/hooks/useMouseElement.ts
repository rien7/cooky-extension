import { useEffect, useState } from 'react'
import type { CursorState } from './useMousePosition'

export default function useMouseElement(keyPress: boolean, position: CursorState | undefined, inBounding: boolean) {
  const [element, setElement] = useState<Element | undefined>(undefined)

  const rootTagName = ['', 'HTML', 'BODY']
  const needMoreCheckTagName = ['DIV']
  const notBeChildTagName = ['PRE', 'BUTTON']
  const includeTagName = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'LI', 'DD', 'DT', 'TD']
  const inlineTagName = ['SPAN', 'CODE', 'B', 'I', 'EM', 'STRONG', 'A', '#text']

  useEffect(() => {
    if (inBounding)
      return
    if (!keyPress || !position) {
      setElement(undefined)
      return
    }

    let element = document.elementFromPoint(position.clientX, position.clientY) || undefined

    if (!element || rootTagName.includes(element.tagName) || element.textContent?.trim() === '')
      return

    let tobeSetElement: Element | undefined
    while (!includeTagName.includes(element.tagName)) {
      // if tagName is div and has no child or all child is inline element, set this element
      if (needMoreCheckTagName.includes(element.tagName)
      && (element.children.length === 0
        || !Array.from(element.children).some(c => !inlineTagName.includes(c.tagName)))) {
        tobeSetElement = element
        break
      }
      if (!element.parentElement)
        break
      if (inlineTagName.includes(element.tagName) && needMoreCheckTagName.includes(element.parentElement.tagName)) {
        tobeSetElement = element.parentElement
        break
      }
      element = element.parentElement
    }

    if (!tobeSetElement
      && (!element || element == null || rootTagName.includes(element.tagName || '') || element.textContent?.trim() === ''))
      return

    if (tobeSetElement) {
      let checkElement: Element | undefined = tobeSetElement
      while (!rootTagName.includes(checkElement?.tagName || '')) {
        if (notBeChildTagName.includes(checkElement?.tagName || '')) {
          tobeSetElement = undefined
          return
        }
        checkElement = checkElement?.parentElement || undefined
      }
    }

    setElement(tobeSetElement || element)
  }, [inBounding, keyPress, position])

  return element
}
