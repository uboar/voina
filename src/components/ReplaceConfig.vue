<script setup lang="ts">
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { ReplaceText } from '../scripts/interfaces';

/**
 * Props
 * -----------------------------------------------------------------------------------------
 */
interface Props {
    modelValue: Array<ReplaceText>
}
const props = defineProps<Props>();

/**
 * Emits
 * -----------------------------------------------------------------------------------------
 */
interface Emits {
    (e: 'update:modelValue', val: Array<ReplaceText>): void
}
const emits = defineEmits<Emits>();

/**
 * Computed
 * -----------------------------------------------------------------------------------------
 */
const currentConfig = computed({
    get() {
        return props.modelValue;
    },
    set(val: Array<ReplaceText>) {
        emits("update:modelValue", val);
    },
})

/**
 * Data
 * -----------------------------------------------------------------------------------------
 */

//追加する置き換えアイテムの情報
const add = ref<ReplaceText>({
    before: "",
    after: "",
});

/**
 * Methods
 * -----------------------------------------------------------------------------------------
 */

/**
 * 置き換えアイテムの削除
 * @param index 
 */
const deleteReplaceItem = (index: number) => {
    console.log(index);
    currentConfig.value.splice(index, 1);
};

/**
 * 置き換えアイテムの追加
 */
const addReplaceItem = () => {
    currentConfig.value.push({ ...add.value })
    add.value.before = "";
    add.value.after = "";
};

/**
 * 入れ替え系メソッド
 */
const swap = (target: number, source: number) => {
    const buff = [...currentConfig.value];
    [buff[target], buff[source]] = [currentConfig.value[source], currentConfig.value[target]];

    currentConfig.value = [...buff];
}

</script>

<template>
    <v-table>
        <thead>
            <tr>
                <th>置き換え前</th>
                <th>置き換え後</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in currentConfig">
                <td>
                    <v-text-field variant="outlined" v-model="item.before" class="mt-3 mb-n2"></v-text-field>
                </td>
                <td>
                    <v-text-field variant="outlined" v-model="item.after" class="mt-3 mb-n2"></v-text-field>
                </td>
                <td style="width: 20rem">
                    <v-btn icon variant="outlined" @click="swap(index - 1, index)" class="mx-2" :disabled="index === 0">
                        <v-icon>mdi-arrow-up</v-icon>
                        <v-tooltip activator="parent" location="top">上と入れ替え</v-tooltip>
                    </v-btn>
                    <v-btn icon variant="outlined" @click="swap(index, index + 1)" class="mx-2"
                        :disabled="index === currentConfig.length - 1">
                        <v-icon>mdi-arrow-down</v-icon>
                        <v-tooltip activator="parent" location="top">下と入れ替え</v-tooltip>
                    </v-btn>
                    <v-btn icon variant="outlined" color="error" @click="deleteReplaceItem(index)" class="mx-2">
                        <v-icon>mdi-delete-forever</v-icon>
                        <v-tooltip activator="parent" location="top">削除する</v-tooltip>
                    </v-btn>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>
                    <v-text-field variant="outlined" v-model="add.before" class="mt-3 mb-n2"></v-text-field>
                </td>
                <td>
                    <v-text-field variant="outlined" v-model="add.after" class="mt-3 mb-n2"></v-text-field>
                </td>
                <td>
                    <v-btn icon variant="outlined" color="info" @click="addReplaceItem()" class="mx-2"
                        :disabled="add.before === ''">
                        <v-icon>mdi-plus</v-icon>
                        <v-tooltip activator="parent" location="top">追加する</v-tooltip>
                    </v-btn>
                </td>
            </tr>
        </tfoot>
    </v-table>
</template>