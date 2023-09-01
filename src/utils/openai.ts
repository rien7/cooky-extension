import OpenAI from 'openai'

export class OpenAi {
  model: string = 'gpt-3.5-turbo'
  target: string = 'zh-Hans'
  openai: OpenAI = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser: true,
  })

  public static SINGLETON = new OpenAi()

  constructor() {
    chrome.storage.local.get(['openAIApiKey'], (result) => {
      if (result.openAIApiKey)
        this.openai.apiKey = result.openAIApiKey
    })
  }

  async translate(text: string, selection: { s: number; e: number }[], target?: string) {
    const systemPrompt = 'You are a translation engine, you can only translate text or explain specified words. Separate explanations with \'\n\'. Separate translation and explanations with \'❖\'. You can only reply directly to the result. Return in a fixed format.'
    const prompt = `Translate the text into ${target || this.target}, and explain the meaning of specified words.\nSentence: \'${text}\'. Selections: [${selection.map(({ s, e }) => `{\'${s}-${e}\': \'${text.slice(s, e)}\'}`).join(',')}]`
    const msgs: { role: 'system' | 'assistant' | 'user'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Translate the text into ${target || this.target}, and explain the meaning of specified words.\nSentence: \'Girls are sitting in the classroom\'. Selections: [{\'0-5\': \'Girls\'},{\'10-17\': \'sitting\'}]` },
      { role: 'assistant', content: '\'0-5\': 女孩\n\'10-17\': 坐下❖女孩们坐在教室里。' },
      { role: 'user', content: prompt },
    ]
    return this.openai.chat.completions.create({
      model: this.model,
      messages: msgs,
      stream: true,
    })
  }
}
