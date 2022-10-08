
export interface HistoryItem {
  selectedQueryText: string,
  selectedResponseText: string,
  ECCERequest: ECCERequest
  ECCEResponse: ECCEResponse
  engine: string
  voicevox?: {
    speaker: number
    audioQuery: VoicevoxAudioQuerySchema
  }
  tamiyasu?: {
    args: string
  }
}