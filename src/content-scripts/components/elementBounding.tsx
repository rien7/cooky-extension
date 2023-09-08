import { useRef } from 'react'
import { SendType } from '../../utils/sendType'
import type { ParagraphDataType } from '../App'
import type { ElementBoundingType } from '../hooks/useElementBounding'
import { generateParagraphId, sendMessage } from '../util/sendMessages'

export default function ElementBounding(props: {
  element: Element
  bounding: ElementBoundingType
  boundingRef: React.MutableRefObject<HTMLDivElement | null>
  elementRef: React.MutableRefObject<HTMLElement | undefined>
  fixed: boolean
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  _paragraphData: React.MutableRefObject<ParagraphDataType[]>
  children: React.ReactNode[]
}) {
  const { element, bounding, boundingRef, elementRef, fixed, setFixed, _paragraphData } = props
  const bodyBounding = document.body.getBoundingClientRect()
  const directTranslate = useRef(false)
  const isBlock = element.classList.contains('cooky-selection-paragraph')

  let color = 'bg-transparent'
  let pointer = 'cursor-pointer'

  if (isBlock && !directTranslate.current) {
    color = 'bg-red-400/40'
    pointer = 'cursor-not-allowed'
  }
  else if (fixed) {
    color = 'bg-transparent'
    pointer = 'cursor-default'
  }

  return (
    <>
    { !directTranslate.current
      && <div ref={boundingRef}
        className={`absolute z-50 ${pointer} ${color} overflow-hidden rounded-lg transition-all duration-300`}
        style={{
          left: bounding.left + bounding.scrollX - 10 - bodyBounding.left,
          top: bounding.top + bounding.scrollY - 10,
          width: bounding.width + 20,
          height: bounding.height + 20,
        }}>
          {!fixed && !isBlock
            && <>
              <div className='absolute left-0 h-full w-3/4 bg-orange-400/20'
                   onClick={() => {
                     const classList = element.classList
                     if (classList.contains('cooky-selection-paragraph'))
                       return
                     setFixed(true)
                     if (!classList.contains('cooky-selecting-paragraph'))
                       element.classList.add('cooky-selecting-paragraph')
                     elementRef.current = element as HTMLElement
                   }}/>
              <div className='group absolute right-0 h-full w-1/4 cursor-e-resize bg-amber-400/20'
                   onClick={() => {
                     directTranslate.current = true
                     const classList = element.classList
                     if (classList.contains('cooky-selection-paragraph'))
                       return
                     setFixed(true)
                     //  if (!classList.contains('cooky-selecting-paragraph'))
                     //    element.classList.add('cooky-selecting-paragraph')
                     elementRef.current = element as HTMLElement
                     const paragraphData = _paragraphData.current
                     const paragraphId = generateParagraphId(element, paragraphData)
                     const pd = {
                       id: paragraphId,
                       element: element as HTMLElement,
                       current: true,
                       text: element.textContent || '',
                       selections: [],
                       selectionsTranslation: [],
                     }
                     paragraphData.push(pd)
                     if (!classList.contains('cooky-selection-paragraph'))
                       element.classList.add('cooky-selection-paragraph', `paragraph-${paragraphId}`)
                     sendMessage(pd, setFixed, element, [], SendType.TRANSLATE_ONLY)
                   }}>
                <svg className="min-h-[calc(1rem + 20px)] absolute left-1/2 top-1/2 h-1/2 max-h-[5rem] max-w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12H18M18 12L13 7M18 12L13 17"
                        stroke="#fb923c" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17"
                        stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </>}
          {props.children}
      </div>
    }
    </>
  )
}
