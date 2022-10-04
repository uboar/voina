<script setup lang="ts">
import { HistoryItem } from '../scripts/interfaces';
import { ref } from 'vue';


interface Props {
    modelValue?: HistoryItem
}

const props = defineProps<Props>();

const clicked = ref(false);

</script>

<template>
    <v-list-item variant="plain" style="cursor:pointer" @click="clicked = true">
        <v-list-item-title>
            履歴1
        </v-list-item-title>
        <v-list-subheader>ここに会話履歴が入ります</v-list-subheader>
    </v-list-item>
    <v-divider></v-divider>
    <v-dialog v-model="clicked">
        <v-card>
            <v-card-title>
                履歴1
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="clicked = false" variant="outlined">閉じる</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>