import { useEffect, useRef } from 'react'
import type { ParagraphDataType } from '../App'
import { SendType } from '../../utils/sendType'
import { generateParagraphId, sendMessage } from '../util/sendMessages'
import type { ElementBoundingType } from '../hooks/useElementBounding'
import { preventDefault } from '../util/listenerFunctions'

export default function ConfirmDot(props: {
  element: Element
  bounding: ElementBoundingType
  _paragraphData: React.MutableRefObject<ParagraphDataType[]>
  setShowBlock: React.Dispatch<React.SetStateAction<boolean>>
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  fixed: boolean
  selection: { s: number; e: number; id: string }[]
}) {
  const { element, bounding, _paragraphData, setShowBlock, setFixed, fixed, selection } = props
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
    let existedPd = paragraphData.find(pd => pd.id === paragraphId)
    if (existedPd) {
      existedPd.current = true
      existedPd.selections = selection
      existedPd.selectionsTranslation = []
    }
    else {
      // add pd to paragraphData
      const pd: ParagraphDataType = {
        id: paragraphId,
        element: element as HTMLElement,
        current: true,
        position: bounding,
        text: element.textContent || '',
        selections: selection,
        selectionsTranslation: [],
        chatHistory: [],
      }
      paragraphData.push(pd)
      existedPd = pd
    }

    if (element.hasAttribute('re-select')) {
      element.removeAttribute('re-select')
      sendType.current = SendType.EXPLAIN_ONLY
    }

    // add paragraph id to element
    if (!element.classList.contains('cooky-selection-paragraph'))
      element.classList.add('cooky-selection-paragraph', `paragraph-${paragraphId}`)
    setShowBlock(false)
    sendMessage(existedPd, setFixed, sendType.current !== SendType.DEFAULT ? sendType.current : undefined)

    // reset <a> tag
    const aTags = document.querySelectorAll('a')
    aTags.forEach((aTag) => {
      aTag.removeEventListener('click', preventDefault)
      const href = aTag.getAttribute('disabled-href')
      if (href) {
        aTag.setAttribute('href', href)
        aTag.removeAttribute('disabled-href')
      }
    })
  }

  return (
    <>
      { fixed && <>
        <div className='absolute -bottom-2 -right-2 h-6 w-6 cursor-pointer rounded-full bg-orange-400 blur-sm transition-all hover:-bottom-8 hover:-right-8 hover:z-50 hover:h-20 hover:w-20 hover:blur-md'
          onClick={handleClick} />
        <div className='absolute right-0 top-0 h-4 w-4 overflow-hidden'>
          <div className='absolute right-[3px] top-[3px] h-8 w-8 rounded-md border-2 border-orange-300'/>
        </div>
      </>}
    </>
  )
}
