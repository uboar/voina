<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Config, ReplaceText } from './scripts/interfaces';
import { loadConfig, initialConfig, writeConfig } from './scripts/configLoader'

import NavbarVue from './components/Navbar.vue';
import VoiceGenConfigVue from './components/VoiceGenConfig.vue';
import ReplaceConfigVue from './components/ReplaceConfig.vue';
import ECCEConfigVue from './components/ECCEConfig.vue';
import TalkModeVue from './components/TalkMode.vue';
import ChatHistory from './components/ChatHistory.vue';

/**
 * Mounted
 * -----------------------------------------------------------------------------------------
 */
const mounted = onMounted(async () => {
  try {
    config.value = await loadConfig();
  } catch (err) {
    showErr(err, "コンフィグファイルの読み込みでエラーが発生しました : ", "error");
  }
});

/**
 * Data
 * -----------------------------------------------------------------------------------------
 */

/**
 * アプリ設定
 */
const config = ref<Config>({
  ...initialConfig
});

/**
 * メインタブ選択
 */
const tabs = ref(0);
/**
 * 設定タブ選択
 */
const configTab = ref(0);
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
const saveConfig = () => {
  try {
    writeConfig(config.value);
  } catch (err) {
    showErr(err, "コンフィグファイルの読み込みでエラーが発生しました : ", "error");
  }
}


</script>

<template>
  <v-app>
    <v-main>
      <navbar-vue v-model="tabs"></navbar-vue>
      <v-window v-model="tabs">
        <!-- 設定タブ -->
        <v-window-item>
          <v-container>
            <v-tabs v-model="configTab">
              <v-tab>音声合成エンジン設定</v-tab>
              <v-tab>ECCE設定</v-tab>
              <v-tab>入力テキスト置き換え設定</v-tab>
              <v-tab>出力テキスト置き換え設定</v-tab>
            </v-tabs>
          </v-container>
          <v-window v-model="configTab">
            <!-- 音声合成エンジン設定タブ -->
            <v-window-item>
              <voice-gen-config-vue v-model="config" @notify="(val) => {showErr(val.err, val.text, val.color)}">
              </voice-gen-config-vue>
            </v-window-item>
            <!-- ECCE設定タブ -->
            <v-window-item>
              <e-c-c-e-config-vue v-model="config" @notify="(val) => {showErr(val.err, val.text, val.color)}">
              </e-c-c-e-config-vue>
            </v-window-item>
            <!-- 入力テキスト設定タブ -->
            <v-window-item>
              <v-container>
                <h1>入力テキスト置き換え設定</h1>
                <p class="mb-4">ECCEに入力するテキストの置き換え設定を行います。上に行くほど優先順位が高くなります。</p>
                <replace-config-vue v-model="config.inputReplaceText"></replace-config-vue>
              </v-container>
            </v-window-item>
            <!-- 出力テキスト設定タブ -->
            <v-window-item>
              <v-container>
                <h1>出力テキスト置き換え設定</h1>
                <p class="mb-4">ECCEから出力される(VOICEVOXに入力する)テキストの置き換え設定を行います。上に行くほど優先順位が高くなります。</p>
                <replace-config-vue v-model="config.outputReplaceText"></replace-config-vue>
              </v-container>
            </v-window-item>
          </v-window>
          <v-footer style="position: fixed; bottom: 0; width: 100%;">
            <v-spacer></v-spacer>
            <v-btn @click="saveConfig" variant="text">コンフィグファイルを上書き</v-btn>
          </v-footer>
        </v-window-item>
        <!-- おしゃべりタブ -->
        <v-window-item>
          <talk-mode-vue :config="config" @notify="(val) => {showErr(val.err, val.text, val.color)}">
          </talk-mode-vue>
        </v-window-item>
        <!-- 履歴タブ -->
        <v-window-item>
          <chat-history></chat-history>
        </v-window-item>
      </v-window>
      <v-snackbar v-model="statusMessage.show" :timeout="2000" :color="statusMessage.color">
        {{statusMessage.text}}
      </v-snackbar>
    </v-main>
  </v-app>
</template>