<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useTheme } from 'vuetify/lib/framework.mjs';

/**
 * Props
 * -----------------------------------------------------------------------------------------
 */
interface Props {
  modelValue: number
};
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
});

/**
 * Emits
 * -----------------------------------------------------------------------------------------
 */
interface Emits {
  (e: 'update:modelValue', value: number): void;
};
const emits = defineEmits<Emits>();

/**
 * Computed
 * -----------------------------------------------------------------------------------------
 */
const tabValue = computed({
  get() {
    return props.modelValue
  },
  set(value: number) {
    emits('update:modelValue', value);
  }
});

/**
 * Data
 * -----------------------------------------------------------------------------------------
 */
const theme = useTheme();

/**
 * Methods
 * -----------------------------------------------------------------------------------------
 */
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

</script>

<template>
  <v-app-bar color="cyan">
    <v-app-bar-title>
      voECCE
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn icon variant="plain" @click="toggleTheme">
        <v-icon>mdi-brightness-6</v-icon>
        <v-tooltip activator="parent" location="bottom">
          テーマ切り替え
        </v-tooltip>
      </v-btn>
    </template>
    <template v-slot:extension>
      <v-tabs fixed-tabs align-with-title v-model="tabValue">
        <v-tab>設定</v-tab>
        <v-tab>おしゃべりする</v-tab>
        <v-tab v-if="false">履歴</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>