/**
 * src/modules/renderer.js
 * コンボデータを解析してHTML（アイコン表示）を生成するモジュール
 */

const ICON_MAP = {
    // ボタン系 (大文字小文字はGitHubのファイル名に合わせる)
    "弱P": "LP.png", "中P": "MP.png", "強P": "HP.png",
    "弱K": "LK.png", "中K": "MK.png", "強K": "HK.png",
    "P": "P.png", "K": "K.png",
    // 方向キー系
    "1": "1.png", "2": "2.png", "3": "3.png", 
    "4": "4.png", "6": "6.png", "7": "7.png", 
    "8": "8.png", "9": "9.png",
    "236": "236.png", "214": "214.png", "22": "22.png",
    "j": "jump.png"
};

/**
 * コマンド文字列を解析してアイコンの配列を返す
 */
function parseCommandToIcons(cmd) {
    if (!cmd) return [];
    const icons = [];
    
    // 3桁コマンドを優先的にスキャン
    const longMotions = ["236", "214", "22", "66"];
    let remainingCmd = cmd;

    longMotions.forEach(m => {
        if (remainingCmd.includes(m)) {
            icons.push(ICON_MAP[m]);
            remainingCmd = remainingCmd.replace(m, "");
        }
    });

    // 残りの1文字ずつをスキャン
    for (const char of remainingCmd) {
        if (ICON_MAP[char]) {
            icons.push(ICON_MAP[char]);
        }
    }
    
    // もし何も見つからず、かつcmd全体がMAPにあるならそれを使う
    if (icons.length === 0 && ICON_MAP[cmd]) {
        return [ICON_MAP[cmd]];
    }
    
    return icons.filter(Boolean);
}

/**
 * メインの描画関数
 */
export function renderComboIcons(comboSteps) {
    if (!comboSteps || comboSteps.length === 0) return "";

    return comboSteps.map((move, index) => {
        const icons = parseCommandToIcons(move.cmd);

        let contentHtml = "";
        if (icons.length > 0) {
            const iconImages = icons.map(img => 
                `<img src="assets/icons/${img}" class="cmd-icon" alt="icon">`
            ).join("");
            
            contentHtml = `
                <div class="move-icon-wrapper">
                    <div class="icon-group">${iconImages}</div>
                    <span class="move-name-sub">${move.name}</span>
                </div>`;
        } else {
            contentHtml = `
                <div class="move-text-wrapper">
                    <span class="move-name-txt">${move.name}</span>
                </div>`;
        }

        const arrowHtml = index < comboSteps.length - 1 
            ? `<span class="combo-arrow">→</span>` 
            : "";

        return `<div class="combo-step">${contentHtml}${arrowHtml}</div>`;
    }).join("");
} // ← ここにドットが紛れ込んでいないか確認してください
