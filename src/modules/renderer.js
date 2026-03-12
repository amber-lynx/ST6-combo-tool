/**
 * src/modules/renderer.js
 */

const ICON_MAP = {
    // ボタン系 (大文字小文字の違いに注意：GitHub上のファイル名に合わせてください)
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
 * コマンド文字列（"2中P"など）を解析してアイコンの配列を返す内部関数
 */
function parseCommandToIcons(cmd) {
    if (!cmd) return [];
    const icons = [];
    
    // 236, 214 などの3桁コマンドを優先的に探す
    const longMotions = ["236", "214", "22", "66"];
    let remainingCmd = cmd;

    longMotions.forEach(m => {
        if (remainingCmd.includes(m)) {
            icons.push(ICON_MAP[m]);
            remainingCmd = remainingCmd.replace(m, "");
        }
    });

    // 残りの1文字ずつ（方向キーやボタン）を解析
    for (const char of remainingCmd) {
        if (ICON_MAP[char]) {
            icons.push(ICON_MAP[char]);
        } else if (ICON_MAP[cmd]) { // もし全体が一致するならそれを使う
            return [ICON_MAP[cmd]];
        }
    }
    
    return icons.filter(Boolean); // nullを除去
}

export function renderComboIcons(comboSteps) {
    if (!comboSteps || comboSteps.length === 0) return "";

    return comboSteps.map((move, index) => {
        // コマンド解析の実行
        const icons = parseCommandToIcons(move.cmd);

        let contentHtml = "";
        if (icons.length > 0) {
            // 解析された複数のアイコン（例：2と中P）を並べる
            const iconImages = icons.map(img => 
                `<img src="assets/icons/${img}" class="cmd-icon" alt="icon">`
            ).join("");
            
            contentHtml = `
                <div class="move-icon-wrapper">
                    <div class="icon-group">${iconImages}</div>
                    <span class="move-name-sub">${move.name}</span>
                </div>`;
        } else {
            // アイコンがない場合はテキスト表示
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
}
/* --- コンボ表示用スタイル（renderer.jsと連動） --- */
.combo-display {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    border: 2px solid var(--accent);
}

.combo-step {
    display: flex;
    align-items: center;
}

.icon-group {
    display: flex;
    gap: 2px; /* 2 と 中P の間の隙間 */
}

.cmd-icon {
    width: 32px; /* アイコンの大きさ */
    height: 32px;
    object-fit: contain;
}

.move-icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.move-name-sub {
    font-size: 10px;
    color: #8b949e;
    margin-top: 2px;
}

.combo-arrow {
    margin: 0 10px;
    color: var(--accent);
    font-weight: bold;
    font-size: 20px;
}
