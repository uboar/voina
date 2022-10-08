import { resourceDir } from '@tauri-apps/api/path'
import { readTextFile, writeTextFile, exists, BaseDirectory } from '@tauri-apps/api/fs';
import { ReplaceText } from './replaceText';
//初期設定

//設定
export interface Config {
    engine: "voicevox" | "tamiyasu"
    chatApi: "ecce" | "aiModelPlayground" | "cce"
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
        knowledgeSetId: string
        l2ReturnNum: number
        l3ReturnNum: number
    }
    cce: {
        subscriptionKey: string
        outputLength: number
    }
    aiModelPlayGround: {
        subscriptionKey: string
        authToken: string
        accessToken: string
        fileName: string
    }
    inputReplaceText: Array<ReplaceText>
    outputReplaceText: Array<ReplaceText>
}

export const initialConfig: Config = {
    engine: "voicevox",
    chatApi: "cce",
    tamiyasu: {
        path: "",
        argument: "",
    },
    voicevox: {
        apiURL: "http://localhost:50021",
        speakerId: 8,
    },
    ecce: {
        subscriptionKey: "",
        knowledgeSetId: "",
        l2ReturnNum: 3,
        l3ReturnNum: 1,
    },
    cce: {
        subscriptionKey: "",
        outputLength: 25,
    },
    aiModelPlayGround: {
        fileName: "Cat Model",
        subscriptionKey: "",
        accessToken: "",
        authToken: "",
    },
    inputReplaceText: [
        {
            before: "つむぎちゃん",
            after: "あなた",
        },
        {
            before: "つむぎ",
            after: "あなた",
        }
    ],
    outputReplaceText: [
        {
            before: "〈わたし〉",
            after: "あーし"
        },
        {
            before: "〈あなた〉",
            after: "マスター"
        }
    ]
};

/**
 * コンフィグファイルをロード
 * @returns コンフィグの内容
 */
export const loadConfig = async (): Promise<Config> => {
    let config = initialConfig;
    if (await exists('config.json', { dir: BaseDirectory.Resource }) as unknown) { // boolean?
        config = JSON.parse(await readTextFile('config.json', { dir: BaseDirectory.Resource })) as Config;
        console.info(`コンフィグファイルを${await resourceDir()}から読み込みました`);
    } else {
        //コンフィグファイルを生成する
        await writeTextFile('config.json', JSON.stringify(config), { dir: BaseDirectory.Resource });
        console.info(`コンフィグファイルを${await resourceDir()}に生成しました`);
    }
    return config;
}

/**
 * コンフィグファイルの上書き
 * @param config 上書きするコンフィグの内容
 */
export const writeConfig = async (config: Config) => {
    if (await exists('config.json', { dir: BaseDirectory.Resource }) as unknown) {
        await writeTextFile('config.json', JSON.stringify(config), { dir: BaseDirectory.Resource });
        console.info("コンフィグファイルを上書きしました");
    } else {
        throw "コンフィグファイルが見つかりません";
    }
}