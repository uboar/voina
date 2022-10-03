
//置き換えテキスト
export interface ReplaceText {
  before: string
  after: string
}

//設定
export interface Config {
  engine: string
  tamiyasu: {
    path: string
    argument: string
  }
  voicevox: {
    apiURL: string
    speakerId: number
  }
  ecce: {
    subscriptionKey: string
    knowledgePath: string
    l2ReturnNum: number
    l3ReturnNum: number
  }
  inputReplaceText: Array<ReplaceText>
  outputReplaceText: Array<ReplaceText>
}

//VOICEVOXの話者データ
export interface VoicevoxSpeakersSchema {
  name: string
  speaker_uuid: string
  styles: Array<{
    id: number
    name: string
  }>
  version: string
}

//VOICEVOXのオーディオクエリ
export interface VoicevoxAudioQuerySchema {
  accent_phrases: Array<{
    moras: Array<{
      text: string
      consonant?: string
      consonant_length?: number
      vowel: string
      vowel_length: number
      pitch: number
    }>
    accent: number
    pause_mora?: Array<{
      text: string,
      consonant?: string
      consonant_length?: number
      vowel: string
      vowel_length: number
      pitch: number
    }>
    is_interrogative?: boolean
  }>
  speedScale: number
  pitchScale: number
  intonationScale: number
  volumeScale: number
  prePhonemeLength: number
  postPhonemeLength: number
  outputSamplingRate: number
  outputStereo: boolean
  kana?: string
}

//ECCEのリクエストボディ
export interface ECCERequestSchema {
  knowledgePath: string
  query: string
  dialogHistory: Array<string>
  l2ReturnNum?: number
  l3ReturnNum?: number
}

//ECCEのレスポンスボディ
export interface ECCEResponseSchema {
  resultResponseType: string
  resultResponseText: string
  responses: Array<{
    type: string
    text: string
    score: number
    kgcKeyword?: string
  }>
  l2Docs: Array<string>
  l3Docs: Array<string>
  type: string
}

export interface HistoryItem {
  selectedQueryText: string,
  selectedResponseText: string,
  ECCERequest: ECCERequestSchema
  ECCEResponse: ECCEResponseSchema
  engine: string
  voicevox?: {
    speaker: number
    audioQuery: VoicevoxAudioQuerySchema
  }
  tamiyasu?: {
    args: string
  }
}