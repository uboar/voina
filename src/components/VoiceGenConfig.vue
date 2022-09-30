<script setup lang="ts">
import { Config, VoicevoxSpeakersSchema } from '../scripts/interfaces';
import { getClient, Body, ResponseType } from '@tauri-apps/api/http';
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { Command } from '@tauri-apps/api/shell';
import { tamiyasuSend } from '../scripts/tamiyasu';
import speakersInit from '../assets/speakers.json'
import Ajv from 'ajv';

/**
 * Props
 * -----------------------------------------------------------------------------------------
 */
interface Props {
  modelValue: Config
}
const props = defineProps<Props>();

/**
 * Emits
 * -----------------------------------------------------------------------------------------
 */
interface Emits {
  (e: 'update:modelValue', value: Config): void
  (e: 'notify', value: {
    err: any
    color: string
    text: string
  }): void
}
const emits = defineEmits<Emits>();

/**
 * Computed
 * -----------------------------------------------------------------------------------------
 */
const currentConfig = computed({
  get() {
    return props.modelValue;
  },
  set(val: Config) {
    emits("update:modelValue", val);
  },
});

/**
 * data
 * -----------------------------------------------------------------------------------------
 */

/**
 * 音声合成エンジンの種類
 */
const engines = [
  {
    text: "VOICEVOX API",
    value: "voicevox",
  },
  {
    text: "民安☆TALK",
    value: "tamiyasu",
  }
]
/**
 * バリデーション系
 */
const ajv = new Ajv();
const URLValid = ref<any>(null);
/**
 * VOICEVOXの話者データ(VOICEVOX APIから取得する)
 */
const speakers = ref<Array<{ text: string, value: number }>>(speakersInit);
/**
 * API待機中判定
 */
const waiting = ref(false);

/**
 * Methods
 * -----------------------------------------------------------------------------------------
 */

/**
 * VOICEVOX APIから話者データを取得して整形する
 */
const getSpeakersData = async function () {
  waiting.value = true;
  try {
    const client = await getClient();
    const response = await client.get(`${currentConfig.value.voicevox.apiURL}/speakers`);
    const vvoxSpeakers = response.data as Array<VoicevoxSpeakersSchema>;

    //話者一覧を初期化
    speakers.value = [];

    //取得した話者データを整形
    vvoxSpeakers.forEach(speakersElem => {
      speakersElem.styles.forEach(stylesElem => {
        speakers.value.push({
          text: `${stylesElem.id}:${speakersElem.name}(${stylesElem.name})`,
          value: stylesElem.id
        })
      })
    });
  } catch (err) { //エラーメッセージの表示
    console.error(err);
    emits("notify", { err: err, text: "エラーが発生しました : ", color: "error" });
  }
  waiting.value = false;
};

/**
 * VOICEVOX APIを使ってテキスト発話する
 */
const vvoxTestSpeak = async function () {
  waiting.value = true;
  try {
    const apiURL = currentConfig.value.voicevox.apiURL;
    const speakerId = currentConfig.value.voicevox.speakerId;

    const client = await getClient();

    //synthesis用のクエリを取得
    const audioQuery = await client.post(`${apiURL}/audio_query?text=${"テスト発話です。"}&speaker=${speakerId}`) as any;
    //音声合成の実行
    const synthesis = await client.post(`${apiURL}/synthesis?speaker=${speakerId}`, Body.json(audioQuery.data), {
      responseType: ResponseType.Binary //arrayだよ
    });

    //synthesisの音声データからURLを生成
    const synthesisAudioURL = window.URL.createObjectURL(new Blob([Uint8Array.from(synthesis.data as Array<number>)]));

    //音声データを再生
    await new Audio(synthesisAudioURL).play();
  } catch (err) {
    console.error(err);
    emits("notify", { err: err, text: "エラーが発生しました : ", color: "error" });
  }
  waiting.value = false;
}

/**
 * 民安☆TALKを使ってテキスト発話する
 */
const tamiyasuTestSpeak = async function () {
  waiting.value = true;
  try {
    await tamiyasuSend("テスト発話です", props.modelValue.tamiyasu.argument);
  } catch (err) {
    console.error(err);
    emits("notify", { err: err, text: "エラーが発生しました : ", color: "error" });
  }
  waiting.value = false;
}

</script>

<template>
  <v-container>
    <v-select label="音声合成エンジンを選択" v-model="currentConfig.engine" :items="engines" item-title="text"
      item-value="value"></v-select>
    <v-divider class="mb-4"></v-divider>
    <!-- VOICEVOXの設定 -->
    <div v-if="currentConfig.engine === 'voicevox'">
      <v-text-field v-model="currentConfig.voicevox.apiURL" label="APIのURL" ref="URLValid"
        :rules="ajv.compile({ format: 'uri' })(currentConfig.voicevox.apiURL) ? undefined : ['URLを入力してください']">
      </v-text-field>
      <v-row>
        <v-col>
          <v-btn block color="light-green" class="mb-4" @click="getSpeakersData" :disabled="waiting">
            <div v-if="waiting">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
            <div v-else>話者一覧を取得</div>
          </v-btn>
        </v-col>
        <v-col>
          <v-btn block color="cyan" class="mb-4" @click="vvoxTestSpeak" :disabled="waiting">
            <div v-if="waiting">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
            <div v-else>テスト発話(音が出ます)</div>
          </v-btn>
        </v-col>
      </v-row>
      <v-autocomplete v-model.number="currentConfig.voicevox.speakerId" label="話者ID" :items="speakers"
        item-title="text" item-value="value"></v-autocomplete>
      <!-- 関連リンクの表示 -->
      <v-card>
        <v-card-title>
          関連リンク
        </v-card-title>
        <v-card-text class="ml-8">
          <ul>
            <li><a :href="`${currentConfig.voicevox.apiURL}/docs`" target="_blank">VOICEVOX API リファレンス(ローカル)</a></li>
          </ul>
        </v-card-text>
      </v-card>
    </div>
    <!-- 民安☆TALKの設定 -->
    <div v-else>
      <v-alert color="warning" variant="outlined" class="mb-4">
        民安☆TALKが存在するフォルダをPATH(環境変数)に追加して下さい。
      </v-alert>
      <v-text-field v-model="currentConfig.tamiyasu.argument" label="追加引数"></v-text-field>
      <v-btn block color="cyan" :disabled="waiting" @click="tamiyasuTestSpeak" class="mb-4">
        <div v-if="waiting">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-else>
          テスト発話
        </div>
      </v-btn><!-- 関連リンクの表示 -->
      <v-card>
        <v-card-title>
          関連リンク
        </v-card-title>
        <v-card-text class="ml-8">
          <ul>
            <li><a href="" target="_blank">民安☆TALK</a></li>
          </ul>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>