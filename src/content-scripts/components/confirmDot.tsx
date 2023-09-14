import { useEffect, useRef } from 'react'
import type { ParagraphDataType } from '../App'
import { SendType } from '../../utils/sendType'
import { generateParagraphId, sendMessage } from '../util/sendMessages'
import type { ElementBoundingType } from '../hooks/useElementBounding'

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
      const href = aTag.getAttribute('disabled-href')
      if (href) {
        aTag.setAttribute('href', href)
        aTag.removeAttribute('disabled-href')
      }
    })
  }

  return (
    <>
      { fixed && <div className='group absolute -bottom-2 -right-2 h-6 w-6 cursor-pointer rounded-full bg-orange-400 transition-all hover:-bottom-4 hover:-right-4 hover:z-50 hover:h-20 hover:w-20'
        onClick={handleClick} >
          <svg className="absolute bottom-7 right-7 m-0 h-0 w-0 opacity-0 transition group-hover:h-8 group-hover:w-8 group-hover:opacity-100"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" fill='#fff'
              d="M18.1437 3.63083C16.9737 3.83896 15.3964 4.36262 13.1827 5.10051L8.17141 6.77094C6.39139 7.36428 5.1021 7.79468 4.19146 8.182C3.23939 8.58693 2.90071 8.86919 2.79071 9.0584C2.45191 9.64118 2.45191 10.361 2.79071 10.9437C2.90071 11.1329 3.23939 11.4152 4.19146 11.8201C5.1021 12.2075 6.39139 12.6379 8.17141 13.2312C8.19952 13.2406 8.22727 13.2498 8.25468 13.2589C8.74086 13.4206 9.11881 13.5464 9.44395 13.764C9.75719 13.9737 10.0263 14.2428 10.236 14.5561C10.4536 14.8812 10.5794 15.2592 10.7411 15.7453C10.7502 15.7727 10.7594 15.8005 10.7688 15.8286C11.3621 17.6086 11.7925 18.8979 12.1799 19.8085C12.5848 20.7606 12.867 21.0993 13.0563 21.2093C13.639 21.5481 14.3588 21.5481 14.9416 21.2093C15.1308 21.0993 15.4131 20.7606 15.818 19.8085C16.2053 18.8979 16.6357 17.6086 17.2291 15.8286L18.8995 10.8173C19.6374 8.60363 20.161 7.02627 20.3692 5.85629C20.5783 4.68074 20.4185 4.1814 20.1185 3.88146C19.8186 3.58152 19.3193 3.42171 18.1437 3.63083ZM17.8746 2.11797C19.1768 1.88632 20.3496 1.93941 21.2051 2.79491C22.0606 3.65041 22.1137 4.82322 21.882 6.12542C21.6518 7.41975 21.0903 9.10415 20.3794 11.2367L18.6745 16.3515C18.096 18.0869 17.6465 19.4354 17.232 20.41C16.8322 21.35 16.3882 22.1457 15.7139 22.5377C14.6537 23.1541 13.3442 23.1541 12.284 22.5377C11.6096 22.1457 11.1657 21.35 10.7658 20.41C10.3513 19.4354 9.90184 18.0869 9.32338 16.3515L9.31105 16.3145C9.10838 15.7065 9.04661 15.5416 8.95909 15.4109C8.86114 15.2646 8.73545 15.1389 8.58913 15.0409C8.4584 14.9534 8.29348 14.8916 7.68549 14.689L7.64845 14.6766C5.91306 14.0982 4.56463 13.6487 3.59005 13.2342C2.64996 12.8343 1.85431 12.3904 1.46228 11.716C0.845906 10.6558 0.845907 9.34634 1.46228 8.28611C1.85431 7.61177 2.64996 7.16781 3.59005 6.76797C4.56464 6.35345 5.91309 5.90397 7.64852 5.3255L12.7633 3.62057C14.8959 2.9097 16.5803 2.34822 17.8746 2.11797ZM17.6807 6.32532C17.9791 6.62702 17.9764 7.11348 17.6747 7.41185L13.5771 11.4643C13.2754 11.7627 12.7889 11.76 12.4905 11.4583C12.1921 11.1566 12.1948 10.6701 12.4965 10.3718L16.5942 6.3193C16.8959 6.02092 17.3823 6.02362 17.6807 6.32532Z"/>
          </svg>
        </div>
      }
    </>
  )
}
