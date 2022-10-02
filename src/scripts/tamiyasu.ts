import { Command } from "@tauri-apps/api/shell";

/**
 * 民安☆TALKで発話
 * @param text 発話するテキスト
 * @param args 引数
 */
export const tamiyasuSend = async (text: string, args = "") => {
    await new Command("tamiyasu", `-${text} ${args}`).execute();
}