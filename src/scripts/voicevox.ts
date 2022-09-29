import { getClient, Body, ResponseType } from '@tauri-apps/api/http';
import { Settings } from './interfaces';


export const voicevoxSend = async (text: string, settings: Settings["voicevox"]) => {
    const client = await getClient();

    //synthesis用のクエリを取得
    const audioQuery = await client.post(`${settings.apiURL}/audio_query?text=${text}&speaker=${settings.speakerId}`) as any;
    //音声合成の実行
    console.log(audioQuery.data);
    const synthesis = await client.post(`${settings.apiURL}/synthesis?speaker=${settings.speakerId}`, Body.json(audioQuery.data), {
        responseType: ResponseType.Binary //arrayだよ
    });

    //synthesisの音声データからURLを生成
    const synthesisAudioURL = window.URL.createObjectURL(new Blob([Uint8Array.from(synthesis.data as Array<number>)]));

    //音声データを再生
    await new Audio(synthesisAudioURL).play();
}