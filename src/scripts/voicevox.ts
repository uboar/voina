import { getClient, Body, ResponseType } from '@tauri-apps/api/http';
import { Config } from './configLoader';

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


/**
 * VOICEVOX話者データの取得
 * @param config VOICEVOXのコンフィグ
 * @returns VOICEVOX話者データ(整形済み)
 */
export const voicevoxGetSpeakers = async (config: Config["voicevox"]): Promise<Array<{ text: string, value: number }>> => {
    let speakers = [] as Array<{ text: string, value: number }>;

    const client = await getClient();
    const response = await client.get(`${config.apiURL}/speakers`);
    const vvoxSpeakers = response.data as Array<VoicevoxSpeakersSchema>;

    //話者一覧を初期化
    speakers = [];

    //取得した話者データを整形
    vvoxSpeakers.forEach(speakersElem => {
        speakersElem.styles.forEach(stylesElem => {
            speakers.push({
                text: `${stylesElem.id}:${speakersElem.name}(${stylesElem.name})`,
                value: stylesElem.id
            });
        })
    });
    return speakers;
}

/**
 * VOICEVOXで発話
 * @param text 発話テキスト
 * @param config VOICEVOXのコンフィグ
 */
export const voicevoxSend = async (text: string, config: Config["voicevox"]) => {
    const client = await getClient();

    //synthesis用のクエリを取得
    const audioQuery = await client.post(`${config.apiURL}/audio_query?text=${text}&speaker=${config.speakerId}`) as any;
    //音声合成の実行
    console.log(audioQuery.data);
    const synthesis = await client.post(`${config.apiURL}/synthesis?speaker=${config.speakerId}`, Body.json(audioQuery.data), {
        responseType: ResponseType.Binary //arrayだよ
    });

    //synthesisの音声データからURLを生成
    const synthesisAudioURL = window.URL.createObjectURL(new Blob([Uint8Array.from(synthesis.data as Array<number>)]));

    //音声データを再生
    await new Audio(synthesisAudioURL).play();
}