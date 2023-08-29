import { useEffect, useRef, useState } from 'react'
import useMouse from './useMouse'
import useKeyPress from './useKeyPress'
import useSelection from './useSelection'

export default function useGetParagraph() {
  const excludeTagName = ['', 'DIV', 'HTML', 'BODY']
  const includeTagName = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'LI']
  const [highlightElement, setHighlightElement] = useState<HTMLElement | undefined>(undefined)
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
        setHighlightElement(element as HTMLElement)
        elementRef.current = element
      }
    }
    else if (!keyPress) {
      const highlightElements = document.querySelectorAll('.highlight')
      highlightElements.forEach(element => element.classList.remove('highlight'))
      elementRef.current = undefined
      setHighlightElement(undefined)
    }
  }, [position, keyPress])

  // function getLeftNode(element: HTMLElement, action: (element: HTMLElement) => void) {
  //   const _childNodes = element.childNodes
  //   if (_childNodes.length === 0) {
  //     action(element)
  //   }
  //   else {
  //     for (const _childNode of _childNodes) {
  //       const childNode = _childNode as HTMLElement
  //       getLeftNode(childNode, action)
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (!elementRef.current)
  //     return
  //   const _childNodes = elementRef.current.childNodes
  //   let offsetStart = 0
  //   let selectionIndex = 0
  //   for (const _childNode of _childNodes) {
  //     const childNode = _childNode as HTMLElement
  //     let count = offsetStart
  //     const offsetEnd = offsetStart + (childNode.textContent?.length || 0)
  //     if (selectionIndex >= selections.length)
  //       break
  //     if (offsetEnd < selections[selectionIndex].s) {
  //       offsetStart = offsetEnd
  //       continue
  //     }
  //     // selections[selectionIndex].s <= offsetEnd
  //     getLeftNode(childNode, (element) => {
  //       if (count + (element.textContent?.length || 0) < selections[selectionIndex].e) {
  //         console.log('in if: ', element.textContent)
  //         const selectionElement = document.createElement('cooky-selection')
  //         selectionElement.textContent = element.textContent
  //         if (element.nodeName === '#text')
  //           element.parentElement!.innerHTML = selectionElement.outerHTML
  //         else
  //           element.innerHTML = selectionElement.outerHTML
  //       }
  //       else {
  //         console.log('in else: ', element.textContent)
  //         const first = element.textContent?.slice(0, Math.max(count, selections[selectionIndex].s - count))
  //         const last = element.textContent?.slice(selections[selectionIndex].e - count)
  //         const selectionElement = document.createElement('cooky-selection')
  //         selectionElement.textContent = element.textContent?.slice(selections[selectionIndex].s - count, selections[selectionIndex].e - count) || ''
  //         if (element.nodeName === '#text')
  //           element.parentElement!.innerHTML = first + selectionElement.outerHTML + last
  //         else
  //           element.innerHTML = selectionElement.outerHTML
  //         selectionIndex += 1
  //       }
  //       count += (element.textContent?.length || 0)
  //     })
  //     offsetStart = offsetEnd
  //   }
  // }, [selections])

  return highlightElement
}
