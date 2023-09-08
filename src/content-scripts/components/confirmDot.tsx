import { Md5 } from 'ts-md5'
import type { ParagraphDataType } from '../App'
import { OpenAi } from '../../utils/openai'

export default function ConfirmDot(props: {
  element: Element
  _paragraphData: React.MutableRefObject<ParagraphDataType[]>
  setShowBlock: React.Dispatch<React.SetStateAction<boolean>>
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  fixed: boolean
  selection: { s: number; e: number; id: string }[]
}) {
  const { element, _paragraphData, setShowBlock, setFixed, fixed, selection } = props

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
    const paragraphData = _paragraphData.current
    // generate paragraph id
    let paragraphId = Md5.hashStr(element.textContent || '').padStart(6, '0').slice(0, 6).toUpperCase()
    if (paragraphData.some(item => item.id === paragraphId)) {
      const silbingElements = [element]
      while (paragraphData.some(item => item.id === paragraphId)) {
        silbingElements.push(silbingElements[silbingElements.length - 1]?.nextElementSibling as HTMLElement)
        paragraphId = Md5.hashStr(silbingElements.map(element => element?.textContent).join('') || '').padStart(6, '0').slice(0, 6).toUpperCase()
      }
    }
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
    sendMessage(pd, fixed, setFixed, element, selection)
  }

  return (
    <>
      { fixed && <div className='group absolute -bottom-2 -right-2 h-6 w-6 cursor-pointer rounded-full bg-orange-400 transition-all hover:-bottom-4 hover:-right-4 hover:z-50 hover:h-20 hover:w-20'
        onClick={handleClick} >
          <svg className="absolute bottom-0 right-0 m-0 h-0 w-0 opacity-100 transition group-hover:m-3 group-hover:h-10 group-hover:w-10 group-hover:opacity-100"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18M18 12L13 7M18 12L13 17"
                  stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      }
    </>
  )
}

enum SendType {
  TRANSLATE_ONLY,
  EXPLAIN_ONLY,
  TRANSLATE_AND_EXPLAIN_MIXED,
  TRANSLATE_AND_EXPLAIN_SEPARATELY,
}

async function sendMessage(
  paragraphData: ParagraphDataType,
  fixed: boolean,
  setFixed: React.Dispatch<React.SetStateAction<boolean>>,
  element: Element,
  selection: { s: number; e: number; id: string }[],
  sendType: SendType = SendType.TRANSLATE_AND_EXPLAIN_MIXED,
) {
  if (!fixed)
    setFixed(true)
  let buffer = ''
  let explainationCompleted = false
  if (selection && element.textContent) {
    if (selection.length === 0 && sendType !== SendType.EXPLAIN_ONLY)
      sendType = SendType.TRANSLATE_ONLY
    // translate only
    if (sendType === SendType.TRANSLATE_ONLY) {
      const stream = await OpenAi.SINGLETON.translate(element.textContent)
      for await (const part of stream) {
        const data = part.choices[0]?.delta?.content || ''
        buffer += data
      }
      setTranslation(paragraphData.id, buffer)
      paragraphData.textTranslation = buffer
    }
    // explain only
    else if (sendType === SendType.EXPLAIN_ONLY) {
      const stream = await OpenAi.SINGLETON.explain(element.textContent, selection)
      for await (const part of stream) {
        const data = part.choices[0]?.delta?.content || ''
        if (data === '❖' || data === '\n') {
          buffer = ''
          continue
        }
        buffer += data
        const result = getSelectionTranslationFromBuffer(buffer, selection)
        if (result) {
          setSelectionTranslation(result.id, result.text)
          const seleTran = paragraphData.selectionsTranslation.find(item => item.id === result.id)
          if (!seleTran)
            paragraphData.selectionsTranslation.push(result)
          else
            seleTran.text = result.text
        }
      }
    }
    // translate and explain mixed
    else if (sendType === SendType.TRANSLATE_AND_EXPLAIN_MIXED) {
      const stream = await OpenAi.SINGLETON.translateAndExplain(element.textContent, selection)
      for await (const part of stream) {
        const data = part.choices[0]?.delta?.content || ''
        if (data === '❖') {
          explainationCompleted = true
          buffer = ''
          continue
        }
        if (data === '\n') {
          buffer = ''
          continue
        }
        buffer += data
        if (!explainationCompleted) {
          const result = getSelectionTranslationFromBuffer(buffer, selection)
          if (result) {
            setSelectionTranslation(result.id, result.text)
            const seleTran = paragraphData.selectionsTranslation.find(item => item.id === result.id)
            if (!seleTran)
              paragraphData.selectionsTranslation.push(result)
            else
              seleTran.text = result.text
          }
        }
        else {
          setTranslation(paragraphData.id, buffer)
          paragraphData.textTranslation = buffer
        }
      }
    }

    // send complated
    setFixed(false)
    if (element.classList.contains('cooky-selecting-paragraph'))
      element.classList.remove('cooky-selecting-paragraph')
    paragraphData.current = false
  }
}

function setTranslation(id: string, text: string) {
  const cookySelectionParagraph = document.querySelectorAll(`.paragraph-${id}`)
  if (cookySelectionParagraph.length === 1)
    cookySelectionParagraph[0].setAttribute('data', text)
}

function getSelectionTranslationFromBuffer(buffer: string, selection: { s: number; e: number; id: string }[]) {
  const match = buffer.match(/'?(\d+)-(\d+)'?: (.*)\n?/)
  if (match) {
    const start = Number.parseInt(match[1])
    const end = Number.parseInt(match[2])
    let id = ''
    selection.forEach((item) => {
      if (item.s === start && item.e === end)
        id = item.id
    })
    if (id.length === 22) {
      const text = match[3]
      return { id, text }
    }
  }
  return undefined
}

function setSelectionTranslation(id: string, text: string) {
  const cookySelection = document.querySelectorAll(`cooky-selection[id='${id}']`)
  if (cookySelection.length > 0)
    cookySelection[cookySelection.length - 1].setAttribute('data', text)
}
