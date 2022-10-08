import { getClient, Body, ResponseType, Response } from '@tauri-apps/api/http';
import { Config } from './configLoader';

export interface AMPRequest {
    FileName: string
    ModelType: "CCE+"
    Messages: Array<{
        Sender: "User" | "AI"
        Message: string
    }>
    RuntimeData?: Array<{
        Type: "Data"
        SubType: "Profile" | "ChatHistory"
        Path: string
    }>
}

export interface AMPResponse {
    Response: string
}
let messages: AMPRequest["Messages"] = []

export const getAMP = async (query: string, config: Config["aiModelPlayGround"]) => {
    if (config.subscriptionKey === "") throw "サブスクリプションキーが設定されていません。";
    if (config.accessToken === "") throw "アクセストークンが設定されていません。";

    // 会話履歴に最新の問いかけを追加
    messages.unshift({
        Sender: "User",
        Message: query,
    });


    const client = await getClient();
    const requestBody: AMPRequest = {
        FileName: config.fileName,
        ModelType: "CCE+",
        Messages: messages.slice(0, 4),
        RuntimeData: []
    }

    //AI Model Playground APIにリクエスト送信
    const response = await client.post("https://api.rinna.co.jp/module/amp", Body.json(requestBody), {
        responseType: ResponseType.JSON,
        headers: {
            "Ocp-Apim-Subscription-Key": config.subscriptionKey,
            "AccessToken": config.accessToken,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        },
    }) as any;

    console.log(requestBody);
    console.log(response);
    // TODO : もうちょっとちゃんとバリデーションする
    if (!response.data.Response) throw "AI Model Playground APIからの返答でエラーが発生しました";

    messages.unshift({
        Sender: "AI",
        Message: response.data.Response
    })

    return response.data as AMPResponse
}

export const getAMPAccessToken = async (config: Config["aiModelPlayGround"]) => {
    if (config.subscriptionKey === "") throw "サブスクリプションキーが設定されていません。";
    if (config.authToken === "") throw "認証トークンが設定されていません。";

    const client = await getClient();
    //AI Model Playground APIにリクエスト送信
    const response = await client.post("https://api.rinna.co.jp/module/amp/authorize", Body.text(config.authToken), {
        responseType: ResponseType.Text,
        headers: {
            "Ocp-Apim-Subscription-Key": config.subscriptionKey,
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache",
        },
    }) as any;


    return response.data as string
}

export const deleteHistory = () => {
    messages = [];
}