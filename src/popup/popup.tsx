import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import languages from '../utils/languages'
import { ShortcutKey } from '../utils/shortcutKey'
import '../utils/i18n'

export default function Popup() {
  const [openAIApiKey, setOpenAIApiKey] = useState('')
  const [targetLanguageCode, setTargetLanguageCode] = useState(languages[0].code)
  const [shortcut, setShortcut] = useState<ShortcutKey[]>([])
  const [showKey, setShowKey] = useState(false)
  const [dark, setDark] = useState(false)
  const os = useMemo(() => getOS(), [])

  const { t, i18n } = useTranslation('popup')

  useEffect(() => {
    chrome.storage.local.get(['openAIApiKey'], (result) => {
      setOpenAIApiKey(result.openAIApiKey)
    })
    chrome.storage.local.get(['targetLanguageCode'], (result) => {
      setTargetLanguageCode(result.targetLanguageCode)
      i18n.changeLanguage(result.targetLanguageCode)
    })
    chrome.storage.local.get(['shortcut'], (result) => {
      setShortcut(result.shortcut)
    })
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setDark(e.matches)
    })
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    chrome.storage.local.set({ openAIApiKey: value })
    setOpenAIApiKey(value)
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    setTargetLanguageCode(value)
    chrome.storage.local.set({ targetLanguageCode: value })
    i18n.changeLanguage(value)
  }

  function getOS() {
    const platform = navigator.userAgentData?.platform || window.navigator.platform
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'macOS']
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
    let os = null

    if (macosPlatforms.includes(platform))
      os = 'Mac OS'
    else if (windowsPlatforms.includes(platform))
      os = 'Windows'
    else if (/Linux/.test(platform))
      os = 'Linux'

    return os
  }

  return (
    <>
      <div className={`m-4 w-[25rem] ${dark ? 'dark' : ''}`}>
        <Section title={t('openai api token')}>
          <input
            className="input mb-1 px-2 py-4 font-mono text-xs placeholder:text-neutral-300"
            type={showKey ? 'text' : 'password'}
            placeholder="OpenAI Api Key"
            defaultValue={openAIApiKey}
            onChange={handleChange}
          />
          <input className='h-4 align-text-top'
            type='checkbox' onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setShowKey(e.target.checked) }} />
          <span className='ml-1 align-text-top text-xs text-neutral-900 dark:text-neutral-100'>
            {t('show token')}
          </span>
        </Section>
        <Section title={t('target language')}>
          <select
            className="input p-1"
            value={targetLanguageCode}
            onChange={handleSelectChange}>
            {languages.map((language) => {
              return (
                <option key={language.code} value={language.code}>{language.name}</option>
              )
            })}
          </select>
        </Section>
        <Section title={t('trigger key')}>
        <div className='h-9 w-full rounded-md border-2 border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800'>
          {
            shortcut.map((key, index) => {
              return (
                <>
                  <button
                    key={key}
                    className={'m-1 inline-flex h-6 w-auto items-center rounded-md border-2 border-neutral-300 bg-neutral-50 p-1 font-mono text-xs text-neutral-900 hover:bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-500'}
                    onClick={() => {
                      setShortcut(shortcut.filter(k => k !== key))
                      chrome.storage.local.set({ shortcut: shortcut.filter(k => k !== key) })
                    }}
                  >
                    {os === 'Mac OS'
                      ? key.replace('Alt', 'Option').replace('Meta', 'Command')
                      : os === 'Windows'
                        ? key.replace('Meta', 'Windows')
                        : os === 'Linux' ? key.replace('Meta', 'Super') : key}
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
                className="mx-1 mt-1 h-7 w-auto rounded-md border-2 border-neutral-300 bg-neutral-50 p-1 font-mono text-xs text-neutral-900 hover:bg-neutral-300 disabled:opacity-50 disabled:hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-500"
                onClick={() => {
                  setShortcut([...shortcut, key])
                  chrome.storage.local.set({ shortcut: [...shortcut, key] })
                }}
              >
                {os === 'Mac OS'
                  ? key.replace('Alt', 'Option').replace('Meta', 'Command')
                  : os === 'Windows'
                    ? key.replace('Meta', 'Windows')
                    : os === 'Linux' ? key.replace('Meta', 'Super') : key}
              </button>
            )
          })}
        </div>
        </Section>
      </div>
    </>
  )
}

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <>
      <p className="title">{props.title}</p>
      {props.children}
    </>
  )
}
