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
            <tr v-for="(item, index) in currentSettings">
                <td>
                    <v-text-field variant="outlined" v-model="item.before" class="mt-3 mb-n2"></v-text-field>
                </td>
                <td>
                    <v-text-field variant="outlined" v-model="item.after" class="mt-3 mb-n2"></v-text-field>
                </td>
                <td>
                    <v-btn icon variant="outlined" color="error" @click="deleteReplaceItem(index)">
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
                    <v-btn icon variant="outlined" color="info" @click="addReplaceItem()">
                        <v-icon>mdi-plus</v-icon>
                        <v-tooltip activator="parent" location="top">追加する</v-tooltip>
                    </v-btn>
                </td>
            </tr>
        </tfoot>
    </v-table>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ReplaceText } from '../scripts/interfaces';

export default defineComponent({
    name: "replaceSettings",
    props: {
        modelValue: {
            type: Array<ReplaceText>,
            required: true,
        }
    },
    data() {
        return {
            currentSettings: [ ...this.modelValue ],
            add: {
                before:"",
                after:""
            } as ReplaceText,
        };
    },
    watch: {
        currentSettings(newVal) {
            this.$emit('update:modelValue', newVal)
        }
    },
    computed: {
        settings: {
            get(): Array<ReplaceText> {
                return this.modelValue
            },
            set(val: Array<ReplaceText>) {
                console.log("set")
                this.$emit('update:modelValue', val)
            }
        }
    },
    methods: {
        deleteReplaceItem(index: number) {
            console.log(index);
            this.currentSettings.splice(index, 1);
        },
        addReplaceItem() {
            this.currentSettings.push({ ...this.add })
            this.add.before = "";
            this.add.after = "";
        },
    }
});
</script>