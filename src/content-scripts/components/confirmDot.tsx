import { useEffect, useRef } from 'react'
import type { ParagraphDataType } from '../App'
import { SendType } from '../../utils/sendType'
import { generateParagraphId, sendMessage } from '../util/sendMessages'

export default function ConfirmDot(props: {
  element: Element
  _paragraphData: React.MutableRefObject<ParagraphDataType[]>
  setShowBlock: React.Dispatch<React.SetStateAction<boolean>>
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  fixed: boolean
  selection: { s: number; e: number; id: string }[]
}) {
  const { element, _paragraphData, setShowBlock, setFixed, fixed, selection } = props
  const sendType = useRef<SendType>(SendType.DEFAULT)

  useEffect(() => {
    chrome.storage.local.get(['sendType'], (result) => {
      sendType.current = result.sendType
    })
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.sendType)
        sendType.current = changes.sendType.newValue
    })
  }, [])

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
    const paragraphData = _paragraphData.current
    // generate paragraph id
    const paragraphId = generateParagraphId(element, paragraphData)
    const pd = {
      id: paragraphId,
      element: element as HTMLElement,
      current: true,
      text: element.textContent || '',
      selections: selection,
      selectionsTranslation: [],
    }
    paragraphData.push(pd)

    // add paragraph id to element
    if (!element.classList.contains('cooky-selection-paragraph'))
      element.classList.add('cooky-selection-paragraph', `paragraph-${paragraphId}`)
    setShowBlock(false)
    sendMessage(pd, setFixed, element, selection, sendType.current !== SendType.DEFAULT ? sendType.current : undefined)
  }

  return (
    <>
      { fixed && <div className='group absolute -bottom-2 -right-2 h-6 w-6 cursor-pointer rounded-full bg-orange-400 transition-all hover:-bottom-4 hover:-right-4 hover:z-50 hover:h-20 hover:w-20'
        onClick={handleClick} >
          <svg className="absolute bottom-0 right-0 m-0 h-0 w-0 opacity-0 transition group-hover:m-3 group-hover:h-10 group-hover:w-10 group-hover:opacity-100"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18M18 12L13 7M18 12L13 17"
                  stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      }
    </>
  )
}
