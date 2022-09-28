<script setup lang="ts">
import { ref } from 'vue';
import { Settings, ReplaceText } from './scripts/interfaces';

import NavbarVue from './components/Navbar.vue';
import VoiceGenSettingsVue from './components/VoiceGenSettings.vue';
import ChatModeVue from './components/ChatMode.vue';
import TalkModeVue from './components/TalkMode.vue';
import ReplaceSettingsVue from './components/ReplaceSettings.vue';
import ECCESettingsVue from './components/ECCESettings.vue';

/**
 * data
 * -----------------------------------------------------------------------------------------
 */

/**
 * アプリ設定
 */
const settings = ref<Settings>({
  engine: "voicevox",
  tamiyasu: {
    path: "",
    argument: "",
  },
  voicevox: {
    apiURL: "http://localhost:50021",
    apiKey: "",
    speakerId: 8,
    defaultPitch: 1.0,
    defaultIntonationScale: 1.0,
    defaultSpeed: 1.0
  },
  ecce: {
    subscriptionKey: "",
    knowledgePath: "ECCE_Sample.txt",
    l2ReturnNum: 3,
    l3ReturnNum: 1,
  },
});
/**
 * 入力テキスト置き換え設定
 */
const inputReplaceOptions = ref<Array<ReplaceText>>([
  {
    before: "つむぎ",
    after: "君",
  }
]);
/**
 * 出力テキスト置き換え設定
 */
const outputReplaceOptions = ref<Array<ReplaceText>>([
  {
    before: "〈わたし〉",
    after: "あーし"
  },
  {
    before: "〈あなた〉",
    after: "マスター"
  }
]);
/**
 * メインタブ選択
 */
const tabs = ref(0);
/**
 * 設定タブ選択
 */
const settingsTab = ref(0);
/**
 * 下部に表示するステータスメッセージ
 */
const statusMessage = ref({
  text: "",
  color: "info",
  show: false,
});

/**
 * エラーメッセージの表示
 */
const showErr = (err: any = "", message: string = "エラーが発生しました : ", color: string = "error") => {
  statusMessage.value.color = color;
  statusMessage.value.text = message + err as string;
  statusMessage.value.show = true;
}
/**
 * Methods
 * -----------------------------------------------------------------------------------------
 */

</script>

<template>
  <v-app>
    <v-main>
      <navbar-vue v-model="tabs"></navbar-vue>
      <v-window v-model="tabs">
        <!-- 設定タブ -->
        <v-window-item>
          <v-container>
            <v-tabs v-model="settingsTab">
              <v-tab>音声合成エンジン設定</v-tab>
              <v-tab>ECCE設定</v-tab>
              <v-tab>入力テキスト置き換え設定</v-tab>
              <v-tab>出力テキスト置き換え設定</v-tab>
            </v-tabs>
          </v-container>
          <v-window v-model="settingsTab">
            <!-- 音声合成エンジン設定タブ -->
            <v-window-item>
              <voice-gen-settings-vue v-model="settings" @notify="(val) => {showErr(val.err, val.text, val.color)}">
              </voice-gen-settings-vue>
            </v-window-item>
            <!-- ECCE設定タブ -->
            <v-window-item>
              <e-c-c-e-settings-vue v-model="settings" @notify="(val) => {showErr(val.err, val.text, val.color)}">
              </e-c-c-e-settings-vue>
            </v-window-item>
            <!-- 入力テキスト設定タブ -->
            <v-window-item>
              <v-container>
                <h1>入力テキスト置き換え設定</h1>
                <p class="mb-4">ECCEに入力するテキストの置き換え設定を行います。上に行くほど優先順位が高くなります。</p>
                <replace-settings-vue v-model="inputReplaceOptions"></replace-settings-vue>
              </v-container>
            </v-window-item>
            <!-- 出力テキスト設定タブ -->
            <v-window-item>
              <v-container>
                <h1>出力テキスト置き換え設定</h1>
                <p class="mb-4">ECCEから出力される(VOICEVOXに入力する)テキストの置き換え設定を行います。上に行くほど優先順位が高くなります。</p>
                <replace-settings-vue v-model="outputReplaceOptions"></replace-settings-vue>
              </v-container>
            </v-window-item>
          </v-window>
        </v-window-item>
        <!-- チャットモードタブ -->
        <v-window-item>
          <chat-mode-vue :settings="settings"></chat-mode-vue>
        </v-window-item>
        <!-- おしゃべりモードタブ -->
        <v-window-item>
          <talk-mode-vue></talk-mode-vue>
        </v-window-item>
      </v-window>
      <v-snackbar v-model="statusMessage.show" :timeout="2000" :color="statusMessage.color">
        {{statusMessage.text}}
      </v-snackbar>
    </v-main>
  </v-app>
</template>