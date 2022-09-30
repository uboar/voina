import { Command } from "@tauri-apps/api/shell";
/**
 * 民安☆TALKを使ってテキスト発話する
 */
export const tamiyasuSend = async (text: string, args = "") => {
    await new Command("tamiyasu", `-${text} ${args}`).execute();
}