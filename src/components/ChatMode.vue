<template>
  <v-container>
    <h1>チャットモード</h1>
    <p>直接文字入力で会話します。各APIの連投制限に注意して下さい。</p>
    <v-divider class="my-4"></v-divider>
    <v-textarea label="クエリ" placeholder="何でも聞いて下さい" v-model="query" :disabled="waiting"></v-textarea>
    <v-btn block class="my-4" color="primary" size="x-large" @click="sendQuery" :disabled="waiting">
      <div v-if="waiting">
        APIからの返答を待っています…
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <p v-else>送信</p>
    </v-btn>
    <vo-e-c-c-e-connector-vue ref="voECCEConnectorRef" :settings="settings"></vo-e-c-c-e-connector-vue>

  </v-container>

</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { Settings } from '../scripts/interfaces';

import VoECCEConnectorVue from './VoECCEConnector.vue';

export default defineComponent({
  name: "chatMode",
  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true
    }
  },
  components: {
    VoECCEConnectorVue
  },
  setup(){
    const voECCEConnectorRef = ref<InstanceType<typeof VoECCEConnectorVue>>()
    return{
      voECCEConnectorRef
    }
  },
  data() {
    return {
      query: "",
      waiting: false,
    }
  },
  methods: {
    sendQuery: async function() {

      this.waiting = true;
      await this.voECCEConnectorRef?.genECCE(this.query);
      this.waiting = false;
    }
  }
});

</script>