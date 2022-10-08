import { getClient, Body, ResponseType, Response } from '@tauri-apps/api/http';
import { Config } from './configLoader';

//CCEのリクエストボディ
export interface CCERequest {
    rawInput: string
    outputLength: number
}

//CCEのレスポンスボディ
export interface CCEResponse {
    answer:string
    type: string
}

/**
 * ECCEにリクエストを送信
 * @param query 返信内容のテキスト
 * @param cceConfig CCEの設定 
 * @returns 
 */
export const getCCE = async (query: string, cceConfig: Config["cce"]): Promise<CCEResponse> => {
    if (cceConfig.subscriptionKey === "") throw "サブスクリプションキーが設定されていません。"
    const requestBody: CCERequest = {
        rawInput: `B: ${query}A:`,
        outputLength: cceConfig.outputLength
    }

    console.log(requestBody);

    const client = await getClient();
    //ECCE APIにリクエスト送信
    const response = await client.post("https://api.rinna.co.jp/models/cce", Body.json(requestBody), {
        headers: {
            "Ocp-Apim-Subscription-Key": cceConfig.subscriptionKey,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        }
    }) as any;


    // TODO : もうちょっとちゃんとバリデーションする
    if (!response.data.answer) throw "ECCEからの返答でエラーが発生しました";

    return response.data as CCEResponse;
}