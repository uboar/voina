<script setup lang="ts">
import { Config } from '../scripts/configLoader';
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import replaceText from '../scripts/replaceText';
import { getECCE, insertHistory as insertHistoryECCE, deleteHisory as deleteHisoryECCE } from '../scripts/ecce';
import { getCCE } from '../scripts/cce';
import { voicevoxSend } from '../scripts/voicevox'
import { tamiyasuSend } from '../scripts/tamiyasu';
import { getAMP, deleteHistory as deleteHisoryAMP } from '../scripts/amp';

/**
 * Props
 * -----------------------------------------------------------------------------------------
 */
interface Props {
    config: Config
};
const props = defineProps<Props>();

/**
 * Emits
 * -----------------------------------------------------------------------------------------
 */
interface Emits {
    (e: 'notify', value: {
        err?: any
        color: string
        text: string
    }): void
}
const emits = defineEmits<Emits>();

/**
 * Computed
 * -----------------------------------------------------------------------------------------
 */
//置換後の送信テキスト
const queryReplaced = computed(() => replaceText(queryText.value, props.config.inputReplaceText));
//置換後の受信テキスト
const responseECCEReplaced = computed(() => replaceText(responseECCEText.value, props.config.outputReplaceText));


/**
 * Data
 * -----------------------------------------------------------------------------------------
 */

//音声認識エンジン
const speech = new window.webkitSpeechRecognition();
//送信テキスト
const queryText = ref("");
//表示を減らす
const compactView = ref(false);
//受信テキスト
const responseECCEText = ref("");
//音声認識中フラグ
const recording = ref(false);
//API返答待ちフラグ
const waiting = ref(false);
//自動送信
const autoSend = ref(true);
//自動削除
const autoDeleteQuery = ref(true);
//会話ロギング無効
const disbleInsertHistory = ref(false);
//追加ディレイの時間
const additionalDelay = ref(1000);

/**
 * Methods
 * -----------------------------------------------------------------------------------------
 */

const sendQueryECCE = async (query: string) => {
    const responseECCE = await getECCE(query, props.config.ecce);
    console.log(responseECCE);

    //TODO : resultResponseText以外で帰ってきた返答候補を選択出来るようにする
    responseECCEText.value = responseECCE.resultResponseText;
    if (!disbleInsertHistory.value) {
        insertHistoryECCE(query, responseECCEText.value);
    }
}

const sendQueryAMP = async (query: string) => {
    const responceAMP = await getAMP(query, props.config.aiModelPlayGround);
    console.log(responceAMP);

    responseECCEText.value = responceAMP.Response;
}

/**
 * クエリを送付
 * @param query 
 */
const sendQuery = async (query: string) => {
    waiting.value = true;
    try {
        switch (props.config.chatApi) {
            case "aiModelPlayground":
                await sendQueryAMP(query);
                break;
            case "ecce":
                await sendQueryECCE(query);
                break;
            case "cce":
                responseECCEText.value = (await getCCE(query, props.config.cce)).answer;
                break;
        }
        if (autoDeleteQuery.value) queryText.value = "";
        switch (props.config.engine) {
            case "voicevox":
                await voicevoxSend(responseECCEReplaced.value, props.config.voicevox);
                break;
            case "tamiyasu":
                tamiyasuSend(responseECCEReplaced.value, props.config.tamiyasu.argument)
                break;
        }
    } catch (err) {
        console.error(err);
        emits("notify", { err: err, color: "error", text: "エラーが発生しました : " })
    }

    window.setTimeout(() => waiting.value = false, additionalDelay.value);
}

/**
 * 音声認識エンジンの起動
 */
const startSpeech = () => {
    waiting.value = true;
    speech.lang = 'ja';
    speech.interimResults = true;
    speech.continuous = true;
    speech.start();
};

/**
 * 音声認識系のイベント
 */
speech.onstart = () => {
    recording.value = true;
    waiting.value = false;
    emits("notify", { color: "info", text: "音声認識サービスに接続されました。" });
}
speech.onspeechstart = () => {
    emits("notify", { color: "info", text: "音声が検出されました。" })
}
speech.onerror = (err) => {
    emits("notify", { color: "info", text: "音声認識でエラーが発生しました : ", err: err });
}
speech.onresult = async (e: SpeechRecognitionEvent) => {
    const results = e.results;
    const startIndex = e.resultIndex;

    queryText.value = results[startIndex][0].transcript;
    if (results[startIndex].isFinal) {
        emits("notify", { color: "info", text: "音声認識が終了しました。" });
        if (!waiting.value && autoSend.value) {
            await sendQuery(queryReplaced.value);
        }
    }
};

/**
 * 音声認識の停止
 */
const stopSpeech = () => {
    speech.stop();
    emits("notify", { color: "info", text: "音声認識サービスを停止しました。" });
    recording.value = false;
};

/**
 * 
 */
const deleteTalkHistory = () => {
    deleteHisoryECCE();
    deleteHisoryAMP();
    emits("notify", { color: "warning", text: "会話履歴を削除しました。" });
};

</script>

<template>
    <v-container>
        <h1>おしゃべりする</h1>
        <v-divider></v-divider>
        <v-textarea class="mt-4" color="primary" variant="solo" :rows="(compactView) ? 2 : 7" no-resize label="送信テキスト"
            :disabled="waiting" v-model="queryText">
        </v-textarea>
        <v-textarea disabled readonly no-resize rows="2" label="送信テキスト(置換後)" v-if="!compactView"
            v-model="queryReplaced">
        </v-textarea>
        <v-divider class="my-2"></v-divider>
        <v-text-field v-model="responseECCEReplaced" readonly label="チャットボットAPIからの返答" variant="outlined"></v-text-field>
        <v-text-field v-model="responseECCEText" density="compact" disabled label="チャットボットAPIからの返答(置換前)"
            v-if="!compactView" variant="outlined">
        </v-text-field>
        <v-divider class="my-2"></v-divider>
        <v-btn block size="x-large" color="cyan" @click="sendQuery(queryReplaced)" :disabled="waiting">
            <div v-if="waiting">
                <v-progress-circular indeterminate></v-progress-circular>
            </div>
            <div v-else>
                手動送信
            </div>
        </v-btn>
        <v-card class="my-2">
            <v-card-text>
                <v-btn @click="stopSpeech" color="purple" variant="outlined" block v-if="recording">音声認識を停止</v-btn>
                <v-btn @click="stopSpeech" color="purple" variant="outlined" block v-else-if="waiting" disabled>
                    <v-progress-circular indeterminate></v-progress-circular>
                </v-btn>
                <v-btn @click="startSpeech" color="purple" block v-else>音声認識を開始</v-btn>
                <v-row class="mt-4">
                    <v-col>
                        <v-checkbox v-model="autoSend" density="compact" class="my-n4" label="音声認識した結果を自動送信する">
                        </v-checkbox>
                        <v-checkbox v-model="disbleInsertHistory" density="compact" class="my-n4"
                            label="会話履歴に返答を追加しない(ECCEのみ)">
                        </v-checkbox>
                        <v-checkbox v-model="autoDeleteQuery" density="compact" class="my-n4" label="送信テキストを自動で削除">
                        </v-checkbox>
                    </v-col>
                    <v-col>
                <v-btn variant="outlined" color="warning" @click="deleteTalkHistory" block class="mb-4">会話履歴をクリア</v-btn>
                        <v-text-field v-model.number="additionalDelay" type="number" label="追加遅延時間(ミリ秒)" variant="outlined" density="compact"></v-text-field>
                    </v-col>
                </v-row>
                <v-switch v-model="compactView" color="primary" label="表示を減らす">
                </v-switch>
            </v-card-text>
        </v-card>
    </v-container>
</template>