/**
 * src/modules/renderer.js
 * コンボデータを解析してHTML（アイコン表示）を生成するモジュール
 */

// コマンドテキストをアイコン画像の名前に変換する辞書
// assets/icons/ 内のファイル名と一致させてください
const ICON_MAP = {
    "弱P": "LP.png", "中P": "MP.png", "強P": "HP.png",
    "弱K": "LK.png", "中K": "MK.png", "強K": "HK.png",
    "2": "2.png", "4": "4.png", "6": "6.png", "8": "8.png",
    "236": "236.png", "214": "214.png", "22": "22.png",
    "j": "jump.png" // ジャンプ攻撃用
};

/**
 * コンボ配列を受け取り、アイコンと矢印を含んだHTML文字列を返す
 * @param {Array} comboSteps 
 * @returns {string} HTML String
 */
export function renderComboIcons(comboSteps) {
    if (!comboSteps || comboSteps.length === 0) return "";

    return comboSteps.map((move, index) => {
        // コマンドからアイコンを特定（例: "2中P" なら "2" を探す）
        // 現状は単純に cmd プロパティをそのまま参照
        const iconFile = ICON_MAP[move.cmd] || null;

        // アイコンがある場合は img タグ、ない場合はテキストを表示
        const contentHtml = iconFile 
            ? `<div class="move-icon-wrapper">
                <img src="assets/icons/${iconFile}" class="cmd-icon" alt="${move.cmd}">
                <span class="move-name-sub">${move.name}</span>
               </div>`
            : `<div class="move-text-wrapper">
                <span class="move-name-txt">${move.name}</span>
               </div>`;

        // 最後の技以外には「→」矢印を付ける
        const arrowHtml = index < comboSteps.length - 1 
            ? `<span class="combo-arrow">→</span>` 
            : "";

        return `
            <div class="combo-step">
                ${contentHtml}
                ${arrowHtml}
            </div>
        `;
    }).join("");
}
