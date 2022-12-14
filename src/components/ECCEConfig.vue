<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { computed } from '@vue/reactivity';
import { Config } from '../scripts/configLoader';
import { getECCE } from '../scripts/ecce';

interface Props {
  modelValue: Config["ecce"]
}
const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', value: Config["ecce"]): void
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
const knowledgeValid = ref<HTMLFormElement>();
const mounted = onMounted(() => {
  subKeyValid.value!.validate();
  knowledgeValid.value!.validate();
});


//APIからのデータ取得中
const waiting = ref(false);
//サブスクリプションキーの表示
const keyShow = ref(false);

//ECCEのAPIテスト
const ECCETest = async function () {
  waiting.value = true;
  try {
    const response = await getECCE("これはテストなんですが、調子はいかが？", config.value);
    emits("notify", { text: response.resultResponseText, color: "info" });
  }catch(err){
    emits("notify", { err: err, text: "エラーが発生しました : ", color: "error" });
  }
  waiting.value = false;
}

</script>

<template>
  <v-row>
    <v-col>
      <v-text-field variant="outlined" :type="keyShow ? 'text' : 'password'" label="subscription Key"
        placeholder="ECCEのsubscription Keyを入力" v-model="config.subscriptionKey"
        :rules="config.subscriptionKey !== '' ? undefined : ['subscription Keyを入力してください']" ref="subKeyValid">
      </v-text-field>
    </v-col>
    <v-col cols="1">
      <v-btn icon="mdi-eye-off" v-if="keyShow" @mouseup="keyShow = false"></v-btn>
      <v-btn icon="mdi-eye-outline" v-else @mousedown="keyShow = true" variant="outlined"></v-btn>
    </v-col>
  </v-row>
  <v-text-field label="知識データのファイルID" placeholder="knowledgeSetId" v-model="config.knowledgeSetId"
    :rules="config.subscriptionKey !== '' ? undefined : ['ファイルIDを入力して下さい']" ref="knowledgeValid">
  </v-text-field>
  <v-row>
    <v-col>
      <v-text-field type="number" label="l2の返却件数" placeholder="l2ReturnNum" v-model.number="config.l2ReturnNum">
      </v-text-field>
    </v-col>
    <v-col>
      <v-text-field type="number" label="l3の返却件数" placeholder="l3ReturnNum" v-model.number="config.l3ReturnNum">
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
</template>