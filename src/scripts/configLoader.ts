import { Config } from "./interfaces";
import { resourceDir } from '@tauri-apps/api/path'
import { readTextFile, writeTextFile, exists, BaseDirectory } from '@tauri-apps/api/fs';

//初期設定
export const initialConfig: Config = {
    engine: "voicevox",
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
        knowledgePath: "ECCE_Sample.txt",
        l2ReturnNum: 3,
        l3ReturnNum: 1,
    },
    inputReplaceText: [
        {
            before: "〈わたし〉",
            after: "あーし"
        },
        {
            before: "〈あなた〉",
            after: "マスター"
        }
    ],
    outputReplaceText: [
        {
            before: "つむぎ",
            after: "君",
        }
    ]
};

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

export const writeConfig = async (config: Config) => {
    if (await exists('config.json', { dir: BaseDirectory.Resource }) as unknown) {
        await writeTextFile('config.json', JSON.stringify(config), { dir: BaseDirectory.Resource });
        console.info("コンフィグファイルを上書きしました");
    } else {
        throw "コンフィグファイルが見つかりません";
    }
}