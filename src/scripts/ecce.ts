import { getClient, Body, ResponseType, Response } from '@tauri-apps/api/http';
import { Config } from './configLoader';
import _ from 'lodash';

//ECCEのリクエストボディ
export interface ECCERequest {
    knowledgeSetId: string
    query: string
    dialogHistory: Array<string>
    l2ReturnNum?: number
    l3ReturnNum?: number
}

//ECCEのレスポンスボディ
export interface ECCEResponse {
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


let dialogHistory = ["", "", "", ""];

/**
 * ECCEにリクエストを送信
 * @param query 返信内容のテキスト
 * @param ecceConfigs ECCEの設定 
 * @returns 
 */
export const getECCE = async (query: string, ecceConfigs: Config["ecce"]): Promise<ECCEResponse> => {
    if (ecceConfigs.subscriptionKey === "") throw "サブスクリプションキーが設定されていません。"
    const requestBody: ECCERequest = {
        knowledgeSetId: ecceConfigs.knowledgeSetId,
        query: query,
        dialogHistory: dialogHistory,
        l2ReturnNum: ecceConfigs.l2ReturnNum,
        l3ReturnNum: ecceConfigs.l3ReturnNum
    }

    console.log(requestBody);

    const client = await getClient();
    //ECCE APIにリクエスト送信
    const response = await client.post("https://api.rinna.co.jp/models/ecce", Body.json(requestBody), {
        headers: {
            "Ocp-Apim-Subscription-Key": ecceConfigs.subscriptionKey,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        }
    }) as any;

    
    // TODO : もうちょっとちゃんとバリデーションする
    if (!response.data.resultResponseText) throw "ECCEからの返答でエラーが発生しました";

    return response.data as ECCEResponse;
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
    if (!response) return;
    dialogHistory[0] = _.cloneDeep(dialogHistory[2]);
    dialogHistory[1] = _.cloneDeep(dialogHistory[3]);
    dialogHistory[2] = request;
    dialogHistory[3] = response;
}