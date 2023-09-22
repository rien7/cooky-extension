import { useRef } from 'react'
import type { ParagraphDataType } from '../App'
import type { ElementBoundingType } from '../hooks/useElementBounding'
import { preventDefault } from '../util/listenerFunctions'

export default function ElementBounding(props: {
  element: Element
  bounding: ElementBoundingType
  boundingRef: React.MutableRefObject<HTMLDivElement | null>
  fixed: boolean
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  _paragraphData: React.MutableRefObject<ParagraphDataType[]>
  children: React.ReactNode[]
}) {
  const { element, bounding, boundingRef, fixed, setFixed } = props
  const bodyBounding = document.body.getBoundingClientRect()
  const directTranslate = useRef(false)
  const isBlock = element.classList.contains('cooky-selection-paragraph')

  let pointer = 'cursor-pointer'

  if (isBlock && !directTranslate.current)
    pointer = 'cursor-not-allowed'
  else if (fixed)
    pointer = 'cursor-default'

  function handleHighlightClick() {
    const classList = element.classList
    if (classList.contains('cooky-selection-paragraph'))
      return
    setFixed(true)
    if (!classList.contains('cooky-selecting-paragraph'))
      element.classList.add('cooky-selecting-paragraph')

    // disable <a> tag
    const aTags = element.querySelectorAll('a')
    aTags.forEach((aTag) => {
      aTag.addEventListener('click', preventDefault)
      const href = aTag.getAttribute('href')
      if (href) {
        aTag.removeAttribute('href')
        aTag.setAttribute('disabled-href', href)
      }
    })
  }

  return (
    <>
    { !directTranslate.current
      && <div ref={boundingRef} className='border-gradient absolute transition-all duration-300'
          style={{
            left: bounding.left + bounding.scrollX - 10 - bodyBounding.left,
            top: bounding.top + bounding.scrollY - 10,
            width: bounding.width + 20,
            height: bounding.height + 20,
          }}>
            <div className={`absolute z-50 rounded-lg ${pointer} overflow-hidden`}
            // rounded-lg ${!fixed && !isBlock ? 'bg-orange-400/20' : 'bg-transparent'}
            onClick={handleHighlightClick}
            style={{
              left: 0,
              top: 0,
              width: bounding.width + 20,
              height: bounding.height + 20,
            }}>
              {props.children}
            </div>
      </div>
    }
    </>
  )
}
