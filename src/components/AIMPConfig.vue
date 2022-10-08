<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { computed } from '@vue/reactivity';
import { Config } from '../scripts/configLoader';
import { getAMPAccessToken, getAMP, deleteHistory } from '../scripts/amp';
interface Props {
    modelValue: Config["aiModelPlayGround"]
}
const props = defineProps<Props>();

interface Emits {
    (e: 'update:modelValue', value: Config["aiModelPlayGround"]): void
    (e: 'notify', value: {
        err?: any
        color: string
        text: string
    }): void
}
const emits = defineEmits<Emits>();

const config = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits("update:modelValue", val);
    },
});


// 初期バリデーション用
const subKeyValid = ref<HTMLFormElement>();
const accessTokenValid = ref<HTMLFormElement>();
const authTokenValid = ref<HTMLFormElement>();
const mounted = onMounted(() => {
    subKeyValid.value!.validate();
    authTokenValid.value!.validate();
    accessTokenValid.value!.validate();
});
const keyShow = ref(false);
const waiting = ref(false);

const AIMPTest = async () => {
    waiting.value = true;
    try {
        const response = await getAMP("テストなんですが、調子はいかが？", config.value);
        emits('notify', { text: response.Response, color: "info" });
    } catch (err) {
        emits("notify", { err: err, text: "エラーが発生しました : ", color: "error" });
    }
    waiting.value = false;
}

const getAccessToken = async () => {
    waiting.value = true;
    try {
        config.value.accessToken = await getAMPAccessToken(config.value);
        deleteHistory();
        emits('notify', { text: "アクセストークンを取得しました", color: "info" });
    } catch (err) {
        console.error(err);
        emits("notify", { err: err, text: "エラーが発生しました : ", color: "error" });
    }
    waiting.value = false;
}
</script>

<template>
    <v-row>
        <v-col>
            <v-text-field variant="outlined" :type="keyShow ? 'text' : 'password'" label="subscription Key"
                placeholder="AI Model Playgroundのsubscription Keyを入力" v-model="config.subscriptionKey"
                :rules="config.subscriptionKey !== '' ? undefined : ['subscription Keyを入力してください']" ref="subKeyValid">
            </v-text-field>
            <v-text-field variant="outlined" :type="keyShow ? 'text' : 'password'" label="Auth Token"
                placeholder="認証トークンを入力" v-model="config.authToken"
                :rules="config.authToken !== '' ? undefined : ['Auth Tokenを入力してください']" ref="authTokenValid">
            </v-text-field>
            <v-text-field variant="outlined" :type="keyShow ? 'text' : 'password'" label="Access Token"
                density="compact" placeholder="アクセストークンを入力" v-model="config.accessToken"
                :rules="config.accessToken !== '' ? undefined : ['Access Tokenを入力してください']" ref="accessTokenValid">
            </v-text-field>
        </v-col>
        <v-col cols="1">
            <v-btn icon="mdi-eye-off" v-if="keyShow" @mouseup="keyShow = false"></v-btn>
            <v-btn icon="mdi-eye-outline" v-else @mousedown="keyShow = true" variant="outlined"></v-btn>
        </v-col>
    </v-row>
    <v-text-field v-model="config.fileName" label="AI Model PlaygroundでアップロードしたTraining Dataのファイル名"
        placeholder="FileName"></v-text-field>
    <v-row>
        <v-col>
            <v-btn block color="teal" :disabled="waiting" class="mb-4" @click="getAccessToken">
                <div v-if="waiting">
                    <v-progress-circular indeterminate></v-progress-circular>
                </div>
                <div v-else>
                    アクセストークンを取得
                </div>
            </v-btn>
        </v-col>
        <v-col>
            <v-btn block color="cyan" :disabled="waiting" class="mb-4" @click="AIMPTest">
                <div v-if="waiting">
                    <v-progress-circular indeterminate></v-progress-circular>
                </div>
                <div v-else>
                    APIテスト
                </div>
            </v-btn>
        </v-col>
    </v-row>
    <!-- 関連リンクの表示 -->
    <v-card>
        <v-card-title>
            関連リンク
        </v-card-title>
        <v-card-text class="ml-8">
            <ul>
                <li><a href="https://developers.rinna.co.jp/amp">AI Model Playgroundについて</a></li>
                <li><a href="https://developers.rinna.co.jp/product#product=ai-model-playground" target="_blank">AI
                        Model Playground API</a></li>
            </ul>
        </v-card-text>
    </v-card>
</template>