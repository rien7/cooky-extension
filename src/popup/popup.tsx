import { useEffect, useState } from 'react'
import languages from '../utils/languages'
import { ShortcutKey } from '../utils/shortcutKey'
import { SendType } from '../utils/sendType'

export default function Popup() {
  const [openAIApiKey, setOpenAIApiKey] = useState('')
  const [targetLanguageCode, setTargetLanguageCode] = useState(languages[0].code)
  const [shortcut, setShortcut] = useState<ShortcutKey[]>([])
  const [sendType, setSendType] = useState<SendType>(SendType.DEFAULT)

  useEffect(() => {
    chrome.storage.local.get(['openAIApiKey'], (result) => {
      setOpenAIApiKey(result.openAIApiKey)
    })
    chrome.storage.local.get(['targetLanguageCode'], (result) => {
      setTargetLanguageCode(result.targetLanguageCode)
    })
    chrome.storage.local.get(['shortcut'], (result) => {
      setShortcut(result.shortcut)
    })
    chrome.storage.local.get(['sendType'], (result) => {
      setSendType(result.sendType)
    })
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    chrome.storage.local.set({ openAIApiKey: value })
    setOpenAIApiKey(value)
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    chrome.storage.local.set({ targetLanguageCode: value })
    setTargetLanguageCode(value)
  }

  function handleSendTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    const sendType = Number.parseInt(value) as SendType
    chrome.storage.local.set({ sendType })
    setSendType(sendType)
  }

  return (
    <>
      <div className="m-4 w-[25rem]">
        <p className='title'>OpenAI Api Key</p>
        <input
          className="block h-[1.5rem] w-full overflow-hidden rounded-md border-2 border-neutral-300 bg-neutral-50 px-2 py-4 font-mono text-xs transition placeholder:text-neutral-300 focus:border-neutral-500 focus:outline-none focus:ring-0"
          type="text"
          placeholder="OpenAI Api Key"
          defaultValue={openAIApiKey}
          onChange={handleChange}
        />
        <p className='title'>Target Language</p>
        <select
          className="h-9 w-full rounded-md border-2 border-neutral-300 bg-neutral-50 p-1 focus:border-neutral-500 focus:outline-none focus:ring-0"
          value={targetLanguageCode}
          onChange={handleSelectChange}>
          {languages.map((language) => {
            return (
              <option key={language.code} value={language.code}>{language.name}</option>
            )
          })}
        </select>
        <p className='title'>Send Type</p>
        <select
          className="h-9 w-full rounded-md border-2 border-neutral-300 bg-neutral-50 p-1 focus:border-neutral-500 focus:outline-none focus:ring-0"
          value={sendType}
          onChange={handleSendTypeChange}>
            <option value={SendType.TRANSLATE_AND_EXPLAIN_MIXED}>合并翻译 (使用较少 token)</option>
            <option value={SendType.TRANSLATE_AND_EXPLAIN_SEPARATELY}>分开翻译 (使用较多 token)</option>
        </select>
        <p className='title'>Trigger Key</p>
        <div className='h-9 w-full rounded-md border-2 border-neutral-300 bg-neutral-50'>
          {
            shortcut.map((key, index) => {
              return (
                <>
                  <button
                    key={key}
                    className={'m-1 inline-flex h-6 w-auto items-center rounded-md border-2 border-neutral-300 bg-neutral-50 p-1 font-mono text-xs hover:bg-neutral-300'}
                    onClick={() => {
                      setShortcut(shortcut.filter(k => k !== key))
                      chrome.storage.local.set({ shortcut: shortcut.filter(k => k !== key) })
                    }}
                  >
                    {key}
                  </button>
                  {index !== shortcut.length - 1 && '+'}
                </>
              )
            })
          }
        </div>
        <div>
          {[
            ShortcutKey.Ctrl,
            ShortcutKey.Shift,
            ShortcutKey.Alt,
            ShortcutKey.Meta,
          ].map((key) => {
            return (
              <button
                key={key}
                disabled={shortcut.includes(key)}
                className="mx-1 mt-1 h-7 w-auto rounded-md border-2 border-neutral-300 bg-neutral-50 p-1 font-mono text-xs hover:bg-neutral-300 disabled:opacity-50 disabled:hover:bg-neutral-50"
                onClick={() => {
                  setShortcut([...shortcut, key])
                  chrome.storage.local.set({ shortcut: [...shortcut, key] })
                }}
              >
                {key}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
