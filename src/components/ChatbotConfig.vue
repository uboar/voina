<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { Config } from "../scripts/configLoader";
import ECCEConfig from "./ECCEConfig.vue";
import CCEConfig from "./CCEConfig.vue";
import AMPConfig from "./AMPConfig.vue";


interface Props { modelValue: Config }
const props = defineProps<Props>();

interface Emits {
    (e: "update:modelValue", value: Config): void
    (e: "notify", value: {
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
    }
});

const chatApis = [
    {
        text: "CCE(Character Conversation Japanese)",
        value: "cce",
    },
    {
        text: "ECCE(Editable Content Conversation Engine)",
        value: "ecce"
    },
    {
        text: "AI Model Playground",
        value: "aiModelPlayground"
    }
]

</script>

<template>
    <v-container>
        <h1>チャットボットAPI設定</h1>
        <v-divider class="mb-4"></v-divider>
        <v-select label="チャットボットAPIを選択" v-model="config.chatApi" :items="chatApis" item-title="text" item-value="value">
        </v-select>
        <v-divider class="mb-4"></v-divider>
        <!-- ECCE -->
        <div v-if="config.chatApi === 'ecce'">
            <ECCEConfig v-model="config.ecce" @notify="(val) => emits('notify',{err: val.err, text: val.text, color: val.color})">
            </ECCEConfig>
        </div>
        <div v-if="config.chatApi === 'cce'">
            <CCEConfig v-model="config.cce" @notify="(val) => emits('notify',{err: val.err, text: val.text, color: val.color})"></CCEConfig>
        </div>
        <div v-if="config.chatApi === 'aiModelPlayground'">
            <AMPConfig v-model="config.aiModelPlayGround" @notify="(val) => emits('notify',{err: val.err, text: val.text, color: val.color})"></AMPConfig>
        </div>
        <v-divider class="mb-4"></v-divider>
    </v-container>
</template>