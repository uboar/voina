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
        <v-tab>チャットモード</v-tab>
        <v-tab>おしゃべりモード</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTheme } from 'vuetify/lib/framework.mjs';

export default defineComponent({
  name: "navbar",
  props: {
    modelValue: {
      type: Number,
      default: 0,
    }
  },
  setup() {
    const theme = useTheme()
    return {
      theme
    };
  },
  computed: {
    tabValue: {
      get(): Number {
        return this.modelValue
      },
      set(val: Number) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
    toggleTheme() {
      this.theme.global.name.value = this.theme.global.current.value.dark ? 'light' : 'dark'
    }
  }
})

</script>