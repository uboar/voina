<script setup lang="ts">
import HistoryView from './HistoryView.vue';

</script>
<template>
    <v-container>
        <h1>会話履歴</h1>
        <v-list>
            <history-view></history-view>
            <history-view></history-view>
            <history-view></history-view>
            <history-view></history-view>
        </v-list>
    </v-container>
</template>