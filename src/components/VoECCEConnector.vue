<template>
    <v-card>
        <v-card-title>
            <v-tabs v-model="statusTab">
                <v-tab>
                    ステータス
                </v-tab>
                <v-tab>
                    会話ログ
                </v-tab>
                <v-tab>
                    コンソール
                </v-tab>
            </v-tabs>
        </v-card-title>
        <v-card-text>
            <v-window v-model="statusTab">
                <v-window-item>

                </v-window-item>
                <v-window-item>

                </v-window-item>
                <v-window-item>
                    <v-textarea v-model="consoleOutput" readonly>
                    </v-textarea>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Settings, ReplaceText } from '../scripts/interfaces';
import axios from 'axios';
import { stringify } from 'querystring';

export default defineComponent({
    name: "voECCEConnector",
    props: {
        settings: {
            type: Object as PropType<Settings>,
            required: true
        }
    },
    data() {
        return {
            statusTab: 0,
            consoleOutput: "",
            dialogHistory: [
                "",
                "",
                "",
                ""
            ]
        }
    },
    methods: {
        genECCE: async function (query: string) {
            const requestQueryText = this.textReplace(query, this.settings.input.replaceOptions)
            console.log(requestQueryText);
            const requestBody = {
                "knowledgePath": "ECCE_Sample.txt",
                "query": requestQueryText,
                "dialogHistory": [...this.dialogHistory],
                "l2ReturnNum": 3,
                "l3ReturnNum": 1
            }

            console.log(requestBody)

            fetch('/api', {
                method: 'POST',
                mode: "cors",
                body: JSON.stringify(requestBody),
                // Request headers
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': '767a570a1ee64f91ac1a8a9447c30494',
                }
            })
                .then(async function(response) {
                    console.log(response);
                    console.log(await response.text());
                })
                .catch(err => console.error(err));
        },
        genVOICEVOX: async function (text: string) {

        },
        genVOICEVOXFast: async function (text: string) {

        },
        textReplace(text: string, rule: Array<ReplaceText>): string {
            rule.forEach((val, index) => {
                text = text.replaceAll(RegExp(val.before, "g"), val.after);
            })

            return text
        }
    }
})
</script>