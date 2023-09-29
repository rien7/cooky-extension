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
    chrome.storage.local.get(['targetLanguageCode'], (result) => {
      this.target = result.targetLanguageCode || 'zh-Hans'
    })
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.openAIApiKey)
        this.openai.apiKey = changes.openAIApiKey.newValue
      if (changes.targetLanguageCode)
        this.target = changes.targetLanguageCode.newValue
    })
  }

  async translate(text: string, target?: string) {
    const systemPrompt = 'You are a translation engine, you can only translate text. If \'\n\' in sentence, DONT remove it. You can only reply directly to the result, NO OTHER DATA AND QUOTA MARK NEEDED.'
    const prompt = `Translate the text into ${target || this.target}.\nSentence: \'${text}\'.`
    const msgs: { role: 'system' | 'assistant' | 'user'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Translate the text into zh-Hans.\nSentence: \'Girls are sitting in the classroom\'.' },
      { role: 'assistant', content: '女孩们坐在教室里。' },
      { role: 'user', content: prompt },
    ]
    return this.openai.chat.completions.create({
      model: this.model,
      messages: msgs,
      stream: true,
      temperature: 0.8,
    })
  }

  async explain(text: string, selection: { s: number; e: number }[], target?: string) {
    const systemPrompt = 'You are a translation engine, you can only explain specified words. Separate explanations with \'\n\'. If \'\n\' in sentence, DONT remove it. You can only reply directly to the result, NO OTHER DATA AND QUOTA MARK NEEDED.'
    const prompt = `Explain the meaning of specified words in ${target || this.target}.\nSentence: \'${text}\'. Selections: [${selection.map(({ s, e }) => `{\'${s}-${e}\': \'${text.slice(s, e)}\'}`).join(',')}]`
    const msgs: { role: 'system' | 'assistant' | 'user'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Explain the meaning of specified words in zh-Hans.\nSentence: \'Girls are sitting in the classroom\'. Selections: [{\'0-5\': \'Girls\'},{\'10-17\': \'sitting\'}]' },
      { role: 'assistant', content: '0-5: 女孩\n10-17: 坐下' },
      { role: 'user', content: prompt },
    ]
    return this.openai.chat.completions.create({
      model: this.model,
      messages: msgs,
      stream: true,
      temperature: 0.8,
    })
  }
}
