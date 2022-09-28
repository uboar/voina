export interface ReplaceText {
  before: string
  after: string
}

export interface Settings {
  engine: string
  tamiyasu: {
    path: string
    argument: string
  }
  voicevox: {
    apiURL: string
    apiKey: string
    speakerId: number
    defaultPitch: number
    defaultIntonationScale: number
    defaultSpeed: number
  }
  ecce: {
    subscriptionKey: string
    knowledgePath: string
    l2ReturnNum: number
    l3ReturnNum: number
  }
}

export interface VoicevoxSpeakersSchema {
  name: string
  speaker_uuid: string
  styles: Array<{
    id: number
    name: string
  }>
  version: string
}

export interface ECCERequestSchema {
  knowledgePath: string
  query: string
  dialogHistory: Array<string>
  l2ReturnNum?: number
  l3ReturnNum?: number
}

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