<template>
  <v-app>
    <v-main>
      <navbar-vue v-model="tabs"></navbar-vue>
      <v-window v-model="tabs">
        <v-window-item>
          <v-tabs v-model="settingsTab">
            <v-tab>API設定</v-tab>
            <v-tab>入力テキスト設定</v-tab>
            <v-tab>出力テキスト設定</v-tab>
          </v-tabs>
          <v-window v-model="settingsTab">
            <v-window-item>
              <api-settings-vue v-model="settings"></api-settings-vue>
            </v-window-item>
            <v-window-item>
              <v-container>
                <h1>入力テキスト設定</h1>
                <p class="mb-4">ECCEに入力するテキストの置き換え設定を行います。上に行くほど優先順位が高くなります。</p>
                <replace-settings-vue v-model="inputReplaceOptions"></replace-settings-vue>
              </v-container>
            </v-window-item>
            <v-window-item>
              <v-container>
                <h1>出力テキスト設定</h1>
                <p class="mb-4">ECCEから出力される(VOICEVOXに入力する)テキストの置き換え設定を行います。上に行くほど優先順位が高くなります。</p>
                <replace-settings-vue v-model="outputReplaceOptions"></replace-settings-vue>
              </v-container>
            </v-window-item>
          </v-window>
        </v-window-item>
        <v-window-item>
          <chat-mode-vue :settings="settings"></chat-mode-vue>
        </v-window-item>
        <v-window-item>
          <talk-mode-vue></talk-mode-vue>
        </v-window-item>
      </v-window>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Settings, ReplaceText } from './scripts/interfaces';

import NavbarVue from './components/Navbar.vue';
import ApiSettingsVue from './components/ApiSettings.vue';
import ChatModeVue from './components/ChatMode.vue';
import TalkModeVue from './components/TalkMode.vue';
import ReplaceSettingsVue from './components/ReplaceSettings.vue';

let settings: Settings = {
  engine: "voicevox",
  tamiyasu: {
    path: "",
    argument: "",
  },
  voicevox: {
    apiUrl: "http://localhost:50021",
    apiKey: "",
    speakerId: 8,
    defaultPitch: 1.0,
    defaultIntonationScale: 1.0,
    defaultSpeed: 1.0
  },
  ecce: {
    subscriptionKey: "",
    knowledgePath: "",
    l2ReturnNum: 3,
    l3ReturnNum: 1,
  },
}

let inputReplaceOptions: Array<ReplaceText> = [
  {
    before: "つむぎ",
    after: "君",
  }
]

let outputReplaceOptions: Array<ReplaceText> = [
  {
    before: "〈わたし〉",
    after: "あーし"
  },
  {
    before: "〈あなた〉",
    after: "マスター"
  }
]

export default defineComponent({
  name: 'App',

  components: {
    NavbarVue,
    ApiSettingsVue,
    ChatModeVue,
    TalkModeVue,
    ReplaceSettingsVue
  },

  data() {
    return {
      tabs: 0,
      settingsTab: 0,
      settings: settings,
      inputReplaceOptions: inputReplaceOptions,
      outputReplaceOptions: outputReplaceOptions
    }
  },
})
</script>
