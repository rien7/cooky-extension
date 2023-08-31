import { useEffect, useRef } from 'react'
import useMouse from './useMouse'
import useKeyPress from './useKeyPress'
import useSelection from './useSelection'

export default function useGetParagraph() {
  const excludeTagName = ['', 'DIV', 'HTML', 'BODY']
  const includeTagName = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'LI']
  const elementRef = useRef<HTMLElement | undefined>(undefined)
  const position = useMouse()
  const keyPress = useKeyPress('MetaLeft')
  const selections = useSelection(elementRef.current)

  useEffect(() => {
    if (keyPress && position) {
      let element: HTMLElement | null = document.elementFromPoint(position.clientX, position.clientY) as HTMLElement

      if (!element || element == null || excludeTagName.includes(element.tagName || ''))
        return
      while (!includeTagName.includes(element?.tagName || '')) {
        if (element.parentElement)
          element = element.parentElement
        else
          break
      }
      if (!element || element == null || excludeTagName.includes(element.tagName || ''))
        return
      if (elementRef.current !== element) {
        const highlightElements = document.querySelectorAll('.highlight')
        highlightElements.forEach(element => element.classList.remove('highlight'))
        element?.classList.add('highlight')
        elementRef.current = element
      }
    }
    else if (!keyPress) {
      const highlightElements = document.querySelectorAll('.highlight')
      highlightElements.forEach(element => element.classList.remove('highlight'))
      elementRef.current = undefined
    }
  }, [position, keyPress])
}
