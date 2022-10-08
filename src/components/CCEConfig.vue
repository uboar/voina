<script setup lang="ts">
import { Config } from '../scripts/configLoader';
import { computed } from '@vue/reactivity'
import { onMounted, ref } from 'vue';
import { getCCE } from '../scripts/cce';

interface Props {
  modelValue: Config["cce"]
}
const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', value: Config["cce"]): void
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

const keyShow = ref(false);

// 初期バリデーション
const subKeyValid = ref<HTMLFormElement>();
const mounted = onMounted(() => {
  subKeyValid.value!.validate();
})

const waiting = ref(false);
const CCETest = async () => {
  waiting.value = true;
  try {
    const response = await getCCE("テストなんですが、調子はいかが？", config.value);
    emits('notify', { text: response.answer, color: "info" });
  } catch (err) {
    emits("notify", { err: err, text: "エラーが発生しました : ", color: "error" });
  }
  waiting.value = false;
}
</script>

<template>
  <v-row>
    <v-col>
      <v-text-field variant="outlined" :type="keyShow ? 'text' : 'password'" label="subscription Key"
        placeholder="CCEのsubscription Keyを入力" v-model="config.subscriptionKey"
        :rules="config.subscriptionKey !== '' ? undefined : ['subscription Keyを入力してください']" ref="subKeyValid">
      </v-text-field>
    </v-col>
    <v-col cols="1">
      <v-btn icon="mdi-eye-off" v-if="keyShow" @mouseup="keyShow = false"></v-btn>
      <v-btn icon="mdi-eye-outline" v-else @mousedown="keyShow = true" variant="outlined"></v-btn>
    </v-col>
  </v-row>
  <v-text-field v-model.number="config.outputLength" type="number" label="出力の最大トークン長(1~25)" min="1" max="25">
  </v-text-field>
  <v-btn block color="cyan" :disabled="waiting" class="mb-4" @click="CCETest">
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
        <li><a href="https://developers.rinna.co.jp/product#product=cce-api" target="_blank">CCE API</a></li>
      </ul>
    </v-card-text>
  </v-card>
</template>