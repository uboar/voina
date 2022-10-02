import { getClient, Body, ResponseType, Response } from '@tauri-apps/api/http';
import { ECCERequestSchema, ECCEResponseSchema, Config } from './interfaces';
import _ from 'lodash';

let dialogHistory = ["", "", "", ""];

/**
 * ECCEにリクエストを送信
 * @param query 返信内容のテキスト
 * @param ecceSetttings ECCEの設定 
 * @returns 
 */
export const getECCE = async (query: string, ecceSetttings: Config["ecce"]): Promise<ECCEResponseSchema> => {
    if (ecceSetttings.subscriptionKey === "") throw "サブスクリプションキーが設定されていません。"
    const requestBody: ECCERequestSchema = {
        knowledgePath: ecceSetttings.knowledgePath,
        query: query,
        dialogHistory: dialogHistory,
        l2ReturnNum: ecceSetttings.l2ReturnNum,
        l3ReturnNum: ecceSetttings.l3ReturnNum
    }

    console.log(requestBody);

    const client = await getClient();
    //ECCE APIにリクエスト送信
    const response = await client.post("https://api.rinna.co.jp/models/ecce", Body.json(requestBody), {
        headers: {
            "Ocp-Apim-Subscription-Key": ecceSetttings.subscriptionKey,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        }
    }) as any;


    // TODO : もうちょっとちゃんとバリデーションする
    if(!response.data.resultResponseText) throw "ECCEからの返答でエラーが発生しました";

    return response.data as ECCEResponseSchema;
}

/**
 * 会話履歴の削除
 */
export const deleteHisory = () => {
    dialogHistory = ["", "", "", ""];
}

/**
 * 会話履歴を追加
 * @param request  送信したテキスト
 * @param response 返信されたテキスト
 */
export const insertHistory = (request: string, response: string) => {
    if(!response) return;
    dialogHistory[0] = _.cloneDeep(dialogHistory[2]);
    dialogHistory[1] = _.cloneDeep(dialogHistory[3]);
    dialogHistory[2] = request;
    dialogHistory[3] = response;
}