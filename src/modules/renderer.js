// src/modules/renderer.js

// コマンド文字列をアイコンファイル名に変換する辞書
const ICON_MAP = {
    "LP": "LP.png", "MP": "MP.png", "HP": "HP.png",
    "LK": "LK.png", "MK": "MK.png", "HK": "HK.png",
    "2": "2.png", "236": "236.png", "214": "214.png"
    // ...必要に応じて追加
};

export function renderComboIcons(comboSteps) {
    return comboSteps.map((m, i) => {
        // cmdが "214K" なら、最初の "214" 部分をアイコンにしたい等の処理
        const iconFile = ICON_MAP[m.cmd] || null;
        
        const content = iconFile 
            ? `<img src="assets/icons/${iconFile}" class="cmd-icon" title="${m.name}">`
            : `<span class="txt-move">${m.name}</span>`;

        return `
            <div class="combo-unit">
                ${content}
                ${i < comboSteps.length - 1 ? '<span class="arrow">→</span>' : ''}
            </div>
        `;
    }).join("");
}
