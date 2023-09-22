import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    'en': {
      popup: {
        'openai api token': 'OpenAI API Token',
        'show token': 'Show Token',
        'target language': 'Target Language',
        'send type': 'Send Type',
        'send type mixed': 'Mixed (Use less tokens)',
        'send type separate': 'Separate (Use more tokens)',
        'trigger key': 'Trigger Key',
      },
    },
    'zh-Hans': {
      popup: {
        'openai api token': 'OpenAI API Token',
        'show token': '显示 Token',
        'target language': '目标语言',
        'send type': '发送类型',
        'send type mixed': '合并 (使用较少 token)',
        'send type separate': '分开 (使用较多 token)',
        'trigger key': '触发键',
      },
    },
    'zh-Hant': {
      popup: {
        'openai api token': 'OpenAI API Token',
        'show token': '顯示 Token',
        'target language': '目標語言',
        'send type': '發送類型',
        'send type mixed': '合併 (使用較少 token)',
        'send type separate': '分開 (使用較多 token)',
        'trigger key': '觸發鍵',
      },
    },
    'ja': {
      popup: {
        'openai api token': 'OpenAI API Token',
        'show token': 'トークンを表示',
        'target language': 'ターゲット言語',
        'send type': '送信タイプ',
        'send type mixed': '混合 (トークンを少なく使用)',
        'send type separate': '分離 (トークンを多く使用)',
        'trigger key': 'トリガーキー',
      },
    },
    'ko': {
      popup: {
        'openai api token': 'OpenAI API Token',
        'show token': '토큰 표시',
        'target language': '대상 언어',
        'send type': '전송 유형',
        'send type mixed': '혼합 (토큰을 적게 사용)',
        'send type separate': '분리 (토큰을 많이 사용)',
        'trigger key': '트리거 키',
      },
    },
  },
  fallbackLng: 'en',
})

export {}
