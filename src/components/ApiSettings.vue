<template>
  <v-container>
    <h1>API設定</h1>
    <p class="mb-4">音声合成エンジンとECCEの設定を行います。ECCEのsubscription Keyの設定は必須です。</p>
    <v-row>
      <v-col>
        <v-card class="ma-2">
          <v-card-title class="text-light-green-darken-1">
            音声合成エンジン設定
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height:25rem">
            <v-select label="音声合成エンジンを選択" v-model="currentSettings.engine" :items="engines" item-title="text"
              item-value="value"></v-select>
            <v-divider class="mb-4"></v-divider>
            <!--VOICEVOXの設定-->
            <div v-if="currentSettings.engine === 'voicevox'">
              <v-text-field v-model="currentSettings.voicevox.apiUrl" label="APIのURL"></v-text-field>
              <v-row>
                <v-col>
                  <v-btn block color="light-green" class="mb-4" @click="getSpeakersData">
                    話者一覧を取得
                  </v-btn>
                </v-col>
                <v-col>                  
                  <v-btn block color="cyan" class="mb-4" @click="testSpeak">
                    テスト発話
                  </v-btn>
                </v-col>
              </v-row>
              <v-select v-model.number="currentSettings.voicevox.speakerId" label="話者ID" :items="speakers"
                item-title="text" item-value="value"></v-select>
            </div>
            <!--民安☆TALKの設定-->
            <div v-else>
              <v-text-field v-model="currentSettings.tamiyasu.path" variant="outlined" label="民安☆TALKのパス"
                @click="selectTamiyasuPath">
              </v-text-field>
              <v-text-field v-model="currentSettings.tamiyasu.argument" label="追加引数"></v-text-field>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <h4 class="ml-4">リンク</h4>
            <v-spacer></v-spacer>
            <v-btn :href="`${currentSettings.voicevox.apiUrl}/docs`" target="_blank">VOICEVOX API リファレンス(ローカル)</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <!--ECCEの設定-->
      <v-col>
        <v-card class="ma-2">
          <v-card-title class="text-indigo-lighten-1">
            ECCE設定
          </v-card-title>
          <v-divider>
          </v-divider>
          <v-card-text style="height:25rem">
            <v-text-field variant="outlined" type="password" label="subscription Key"
              placeholder="ECCEのsubscription Keyを入力" v-model="currentSettings.ecce.subscriptionKey"></v-text-field>
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
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <h4 class="ml-4">リンク</h4>
            <v-spacer></v-spacer>
            <v-btn class="mr-4" href="https://developers.rinna.co.jp/product#product=ecce-api" target="_blank">ECCE
              API
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Settings, VoicevoxSpeakersSchema } from '../scripts/interfaces'
import { open } from '@tauri-apps/api/dialog';
import { getClient, Body, ResponseType } from '@tauri-apps/api/http'


import speakers from '../assets/speakers.json'

export default defineComponent({
  name: "settings",
  props: {
    modelValue: {
      type: Object as PropType<Settings>,
      required: true,
    }
  },
  data() {
    return {
      currentSettings: { ...this.modelValue },
      engines: [
        {
          text: "VOICEVOX API",
          value: "voicevox",
        },
        {
          text: "民安☆TALK",
          value: "tamiyasu",
        }
      ],
      inputReplaceAdd: {
        before: "",
        after: ""
      },
      outputReplaceAdd: {
        before: "",
        after: ""
      },
      speakers: [] as Array<{text: string, value: number}>,
    }
  },
  watch: {
    currentSettings(newVal) {
      this.$emit('update:modelValue', newVal)
    }
  },
  computed: {
    settings: {
      get(): Settings {
        return this.modelValue
      },
      set(val: Settings) {
        console.log("set")
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
    selectTamiyasuPath: async function () {
      const selected = await open({
        filters: [
          {
            name: "exe file",
            extensions: ['exe']
          }
        ]
      });
      this.currentSettings.tamiyasu.path = selected as string;
    },
    getSpeakersData: async function() {
      const client = await getClient();
      const response = await client.get(`${this.currentSettings.voicevox.apiUrl}/speakers`);
      const vvoxSpeakers = response.data as Array<VoicevoxSpeakersSchema>;

      this.speakers = [];
      vvoxSpeakers.forEach(speakersElem => {
        speakersElem.styles.forEach(stylesElem => {
          this.speakers.push({
            text: `${stylesElem.id}:${speakersElem.name}(${stylesElem.name})`,
            value: stylesElem.id
          }) 
        })
      });
    },
    testSpeak: async function()
    {
      const client = await getClient();
      
      const audioQuery = await client.post(`${this.currentSettings.voicevox.apiUrl}/audio_query?text=${"テスト発話です。"}&speaker=${this.currentSettings.voicevox.speakerId}`) as any;
      const synthesis = await client.post(`${this.currentSettings.voicevox.apiUrl}/synthesis?speaker=${this.currentSettings.voicevox.speakerId}`, Body.json(audioQuery.data), {
        responseType: ResponseType.Binary //arrayだよ
      });
      new Audio(window.URL.createObjectURL(new Blob([Uint8Array.from(synthesis.data as Array<number>)]))).play();
    }
  }
})
</script>