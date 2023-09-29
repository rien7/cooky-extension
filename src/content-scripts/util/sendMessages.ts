import { OpenAi } from '../../utils/openai'
import { SendType } from '../../utils/sendType'
import type { ParagraphDataType } from '../App'

export async function sendMessage(
  paragraphData: ParagraphDataType,
  setFixed: React.Dispatch<React.SetStateAction<boolean>>,
  sendType: SendType = SendType.TRANSLATE_AND_EXPLAIN_SEPARATELY,
) {
  const element = paragraphData.element
  const selection = paragraphData.selections
  let buffer = ''
  let anotherBuffer = ''
  if (selection && element.textContent) {
    if (selection.length === 0 && sendType !== SendType.EXPLAIN_ONLY)
      sendType = SendType.TRANSLATE_ONLY
    // translate only
    if (sendType === SendType.TRANSLATE_ONLY) {
      const stream = await OpenAi.SINGLETON.translate(element.textContent)
      for await (const part of stream) {
        const data = part.choices[0]?.delta?.content || ''
        buffer += data
        setTranslation(paragraphData.id, buffer)
        paragraphData.textTranslation = buffer
      }
    }
    // explain only
    else if (sendType === SendType.EXPLAIN_ONLY) {
      const stream = await OpenAi.SINGLETON.explain(element.textContent, selection)
      for await (const part of stream) {
        const data = part.choices[0]?.delta?.content || ''
        if (data === '\n') {
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
    // translate and explain separately
    else if (sendType === SendType.TRANSLATE_AND_EXPLAIN_SEPARATELY) {
      // eslint-disable-next-line no-async-promise-executor
      const translate = new Promise(async (resolve) => {
        const stream = await OpenAi.SINGLETON.translate(element.textContent!)
        for await (const part of stream) {
          const data = part.choices[0]?.delta?.content || ''
          buffer += data
          setTranslation(paragraphData.id, buffer)
          paragraphData.textTranslation = buffer
        }
        resolve(undefined)
      })
      // eslint-disable-next-line no-async-promise-executor
      const explain = new Promise(async (resolve) => {
        const stream = await OpenAi.SINGLETON.explain(element.textContent!, selection)
        for await (const part of stream) {
          const data = part.choices[0]?.delta?.content || ''
          if (data === '❖' || data === '\n') {
            anotherBuffer = ''
            continue
          }
          anotherBuffer += data
          const result = getSelectionTranslationFromBuffer(anotherBuffer, selection)
          if (result) {
            setSelectionTranslation(result.id, result.text)
            const seleTran = paragraphData.selectionsTranslation.find(item => item.id === result.id)
            if (!seleTran)
              paragraphData.selectionsTranslation.push(result)
            else
              seleTran.text = result.text
          }
        }
        resolve(undefined)
      })
      await Promise.all([translate, explain])
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
