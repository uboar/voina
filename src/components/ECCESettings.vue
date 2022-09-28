<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { computed } from '@vue/reactivity';
import { Settings, ECCERequestSchema, ECCEResponseSchema } from '../scripts/interfaces';
import { getClient, Body, ResponseType } from '@tauri-apps/api/http';

/**
 * Props
 * -----------------------------------------------------------------------------------------
 */
interface Props {
  modelValue: Settings
}
const props = defineProps<Props>();

/**
 * Emits
 * -----------------------------------------------------------------------------------------
 */
interface Emits {
  (e: 'update:modelValue', value: Settings): void
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
const currentSettings = computed({
  get() {
    return props.modelValue;
  },
  set(val: Settings) {
    emits("update:modelValue", val);
  },
});

/**
 * Mounted
 * -----------------------------------------------------------------------------------------
 */

const mounted = onMounted(() => {
  subKeyValid.value.validate();
});

/**
 * Data
 * -----------------------------------------------------------------------------------------
 */

/**
 * APIからのデータ取得中
 */
const waiting = ref(false);

/**
 * サブスクリプションキーのバリデーションデータ
 */
const subKeyValid = ref<any>(null);

/**
 * サブスクリプションキーの表示
 */
const keyShow = ref(false);

/**
 * Methods
 * -----------------------------------------------------------------------------------------
 */

/**
 * ECCEのAPIテスト
 */
const ECCETest = async function () {
  waiting.value = true;
  try {
    const ecceSetttings = currentSettings.value.ecce;
    const requestBody: ECCERequestSchema = {
      knowledgePath: ecceSetttings.knowledgePath,
      query: "これはテストなんですが、調子はいかが？",
      dialogHistory: ["", "", "", ""],
      l2ReturnNum: ecceSetttings.l2ReturnNum,
      l3ReturnNum: ecceSetttings.l3ReturnNum
    }

    const client = await getClient();
    //ECCE APIにリクエスト送信
    const response = await client.post("https://api.rinna.co.jp/models/ecce", Body.json(requestBody), {
      headers: {
        "Ocp-Apim-Subscription-Key": ecceSetttings.subscriptionKey,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      }
    });
    console.log(response);
    const receivedData = response.data as ECCEResponseSchema;
    emits("notify", { text: receivedData.resultResponseText, color: "info" });
  } catch (err) {
    console.error(err);
    emits("notify", { err: err, text: "エラーが発生しました : ", color: "error" });
  }
  waiting.value = false;
}

</script>

<template>
  <v-container>
    <h1>ECCE設定</h1>
    <p class="mb-4"></p>
    <v-row>
      <v-col>
        <v-text-field variant="outlined" :type="keyShow ? 'text' : 'password'" label="subscription Key"
          placeholder="ECCEのsubscription Keyを入力" v-model="currentSettings.ecce.subscriptionKey"
          :rules="currentSettings.ecce.subscriptionKey !== '' ? undefined : ['subscription Keyを入力してください']"
          ref="subKeyValid">
        </v-text-field>
      </v-col>
      <v-col cols="1">
        <v-btn icon="mdi-eye-off" v-if="keyShow" @mouseup="keyShow = false"></v-btn>
        <v-btn icon="mdi-eye-outline" v-else @mousedown="keyShow = true" variant="outlined"></v-btn>
      </v-col>
    </v-row>
    <v-text-field label="知識データのファイルパス" placeholder="knowledgePath" v-model="currentSettings.ecce.knowledgePath">
    </v-text-field>
    <v-row>
      <v-col>
        <v-text-field type="number" label="l2の返却件数" placeholder="l2ReturnNum"
          v-model.number="currentSettings.ecce.l2ReturnNum"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field type="number" label="l3の返却件数" placeholder="l3ReturnNum"
          v-model.number="currentSettings.ecce.l3ReturnNum">
        </v-text-field>
      </v-col>
    </v-row>
    <v-btn block color="cyan" :disabled="waiting" class="mb-4" @click="ECCETest">
      <div v-if="waiting">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else>
        APIテスト
      </div>
    </v-btn>
    <!-- 関連リンクの表示 -->
    <v-card>
      <v-card-title>
        関連リンク
      </v-card-title>
      <v-card-text class="ml-8">
        <ul>
          <li><a href="https://developers.rinna.co.jp/product#product=ecce-api" target="_blank">ECCE API</a></li>
        </ul>
      </v-card-text>
    </v-card>
  </v-container>
</template>