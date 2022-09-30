<script setup lang="ts">
import { ReplaceText, Config } from '../scripts/interfaces';
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import replaceText from '../scripts/replaceText';
import { getECCE, insertHistory } from '../scripts/ecce';
import { voicevoxSend } from '../scripts/voicevox'
import { tamiyasuSend } from '../scripts/tamiyasu';

/**
 * Props
 * -----------------------------------------------------------------------------------------
 */
interface Props {
    config: Config
    inputReplaceOption: Array<ReplaceText>
    outputReplaceOption: Array<ReplaceText>
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
const queryReplaced = computed(() => replaceText(queryText.value, props.inputReplaceOption));
const responseECCEReplaced = computed(() => replaceText(responseECCEText.value, props.outputReplaceOption));


/**
 * Data
 * -----------------------------------------------------------------------------------------
 */
const queryText = ref("");
const responseECCEText = ref("");
const waiting = ref(false);

/**
 * Methods
 * -----------------------------------------------------------------------------------------
 */
const sendQuery = async (query: string) => {
    waiting.value = true;
    try {
        const responseECCE = await getECCE(query, props.config.ecce);
        console.log(responseECCE);

        //TODO : resultResponseText以外で帰ってきた返答候補を選択出来るようにする
        responseECCEText.value = responseECCE.resultResponseText;
        insertHistory(query, responseECCEText.value);
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
    waiting.value = false;
}

</script>

<template>
    <v-container>
        <h1>おしゃべりする</h1>
        <v-divider></v-divider>
        <v-row class="mt-4">
            <v-col>
                <v-textarea color="primary" variant="solo" rows="7" no-resize label="送信クエリ" v-model="queryText">
                </v-textarea>
            </v-col>
            <v-col>
                <v-textarea disabled readonly no-resize rows="7" label="送信クエリ(置換後)" v-model="queryReplaced">
                </v-textarea>
            </v-col>
        </v-row>
        <v-divider class="my-2"></v-divider>
        <v-btn block size="x-large" color="cyan" @click="sendQuery(queryReplaced)">
            <div v-if="waiting">
                <v-progress-circular indeterminate></v-progress-circular>
            </div>
            <div v-else>
                クエリ手動送信
            </div>
        </v-btn>
        <v-divider class="my-2"></v-divider>
        <v-row>
            <v-col>
                <v-text-field v-model="responseECCEText" readonly label="ECCEからの返答" variant="outlined"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field v-model="responseECCEReplaced" disabled label="ECCEからの返答(置換後)" variant="outlined">
                </v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>