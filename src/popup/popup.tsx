import { useEffect, useState } from 'react'

export default function Popup() {
  const [openAIApiKey, setOpenAIApiKey] = useState('')

  useEffect(() => {
    chrome.storage.local.get(['openAIApiKey'], (result) => {
      setOpenAIApiKey(result.openAIApiKey)
    })
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    chrome.storage.local.set({ openAIApiKey: value })
    setOpenAIApiKey(value)
  }

  return (
    <>
      <div className="m-4 w-[25rem]">
        <p>OpenAI Api Key</p>
        <input
          className="mt-1 block h-[1.5rem] w-full overflow-hidden rounded-md border-2 border-neutral-300 bg-neutral-50 px-2 py-4 font-mono text-xs transition placeholder:text-neutral-300 focus:border-neutral-500 focus:outline-none focus:ring-0"
          type="text"
          placeholder="OpenAI Api Key"
          defaultValue={openAIApiKey}
          onChange={handleChange}
      />
      </div>
    </>
  )
}
