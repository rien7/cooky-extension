import { useEffect, useState } from 'react'
import useMouse from './useMouse'
import useKeyPress from './useKeyPress'

export default function useGetParagraph() {
  const excludeTagName = ['', 'DIV']
  const includeTagName = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'LI']
  const [highlightElement, setHighlightElement] = useState<HTMLElement | undefined>(undefined)
  const position = useMouse()
  const keyPress = useKeyPress('MetaLeft')

  useEffect(() => {
    const highlightElements = document.querySelectorAll('.highlight')
    highlightElements.forEach(element => element.classList.remove('highlight'))
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

      element?.classList.add('highlight')
      if (element)
        setHighlightElement(element as HTMLElement)
    }
  }, [position, keyPress])

  return highlightElement
}
