<template>
  <v-container>
    <h1>おしゃべりモード</h1>
    <p>ブラウザの音声認識機能を使用して会話します。各APIの連投制限に注意して下さい。</p>
    <v-divider class="my-4"></v-divider>
    <v-textarea label="クエリ" placeholder="音声認識された文章がここに入力されます" v-model="query" :disabled="waiting" readonly></v-textarea>
    <v-btn :color="recording ? 'gray' : 'info'" size="large" @click="toggleRecording" :disabled="waiting">
      <div v-if="waiting">APIからの返答を待っています…
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else-if="recording">音声認識を停止</div>
      <div v-else>音声認識を開始</div>
    </v-btn>
    <v-btn block color="primary" size="x-large" @click="sendQuery" :disabled="waiting">
      <div v-if="waiting">
        APIからの返答を待っています…
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <p v-else>送信</p>
    </v-btn>
  </v-container>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "talkMode",
  data() {
    return {
      query: "",
      waiting: false,
      recording: false,
    }
  },
  methods: {
    toggleRecording() {
      this.recording = !this.recording;
    },
    sendQuery() {
      this.waiting = true;
    }
  }
});

</script>