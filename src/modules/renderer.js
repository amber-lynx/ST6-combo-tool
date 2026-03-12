/**
 * src/modules/renderer.js
 */

const ICON_MAP = {
    "弱P": "LP.png", "中P": "MP.png", "強P": "HP.png",
    "弱K": "LK.png", "中K": "MK.png", "強K": "HK.png",
    "P": "P.png", "K": "K.png",
    "1": "1.png", "2": "2.png", "3": "3.png", 
    "4": "4.png", "6": "6.png", "7": "7.png", 
    "8": "8.png", "9": "9.png",
    "236": "236.png", "214": "214.png", "22": "22.png",
    "j": "jump.png"
};

// --- 既存のコマンド変換ロジック ---
function parseCommandToIcons(cmd) {
    if (!cmd) return [];
    let icons = [];
    const longMotions = ["236", "214", "22", "66"];
    let remainingCmd = cmd;

    longMotions.forEach(m => {
        if (remainingCmd.includes(m)) {
            icons.push(ICON_MAP[m]);
            remainingCmd = remainingCmd.replace(m, "");
        }
    });

    for (const char of remainingCmd) {
        if (ICON_MAP[char]) {
            icons.push(ICON_MAP[char]);
        }
    }
    
    return icons.filter(Boolean);
}

// --- 既存のコンボ表示ロジック（そのまま） ---
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
}

// --- 【新規】技一覧の描画ロジック（横スクロール・ジャンプ対応） ---
export function renderMoveList(moves, onMoveClick) {
    const moveListArea = document.getElementById('moveList');
    if (!moveListArea) return;
    moveListArea.innerHTML = '';

    // カテゴリーの定義
    const categories = [
        { id: 'normal', title: '通常技', types: ['normal'] },
        { id: 'unique', title: '特殊技', types: ['unique'] },
        { id: 'special', title: '必殺技', types: ['special'] },
        { id: 'super', title: 'SA', types: ['super'] }
    ];

    categories.forEach(cat => {
        // カテゴリーごとのコンテナ作成
        const section = document.createElement('div');
        section.className = 'category';
        section.setAttribute('data-category', cat.id); // ジャンプ用に属性付与
        
        section.innerHTML = `<h3>${cat.title}</h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'move-grid';

        // 該当する技を抽出
        const filteredMoves = moves.filter(m => m.type === cat.id);
        
        filteredMoves.forEach(move => {
            const btn = document.createElement('button');
            btn.className = 'standingBtn'; // style.cssの既存クラスを適用
            btn.innerHTML = `<span>${move.name}</span>`;
            btn.onclick = () => {
                onMoveClick(move);
                // 追加した瞬間にコンボ欄を右端へオートスクロール
                const display = document.getElementById('comboDisplay');
                setTimeout(() => {
                    display.scrollTo({ left: display.scrollWidth, behavior: 'smooth' });
                }, 50);
            };
            grid.appendChild(btn);
        });

        section.appendChild(grid);
        moveListArea.appendChild(section);
    });
}
