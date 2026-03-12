import { renderComboIcons } from './src/modules/renderer.js';

let combo = [];
let isODMode = false;
let isCorner = false;
let movesData = null;

/**
 * 1. アプリ初期化
 */
async function init() {
    try {
        const response = await fetch('./assets/data/move_list.json');
        if (!response.ok) throw new Error("JSONが見つかりません");
        movesData = await response.json();
        
        applyTheme();
        drawMoves();
        updateStats();
    } catch (e) {
        console.error("初期化エラー:", e);
        // エラー時、ユーザーに分かりやすく表示
        document.getElementById("moveList").innerHTML = "<p>データの読み込みに失敗しました。パスを確認してください。</p>";
    }
}

/**
 * 2. 関数をHTMLから呼べるように公開 (windowに登録)
 */
window.setTheme = (theme) => {
    localStorage.setItem("selectedTheme", theme);
    applyTheme();
};

function applyTheme() {
    const theme = localStorage.getItem("selectedTheme") || "dark";
    document.body.className = 'theme-' + theme;
}

window.toggleOD = () => {
    isODMode = !isODMode;
    const btn = document.getElementById("odSwitcher");
    if(btn) {
        btn.classList.toggle("active", isODMode);
        btn.innerText = isODMode ? "ODモード: ON 🔥" : "ODモード: OFF";
    }
    drawMoves();
};

window.toggleCorner = () => {
    isCorner = !isCorner;
    const btn = document.getElementById("cornerSwitcher");
    if(btn) {
        btn.innerText = isCorner ? "場所: 画面端 🧱" : "場所: 中央";
    }
};

window.addMove = (moveStr) => {
    // 文字列として渡されたJSONをオブジェクトに戻す
    const m = JSON.parse(moveStr);
    let finalMove = { ...m };
    
    if (isODMode && m.hasOD) {
        finalMove.name = "OD" + m.name;
        finalMove.dmg = m.odDmg || m.dmg;
        finalMove.drive = m.odGauge || 0;
    } else {
        finalMove.drive = m.gauge || 0;
    }

    combo.push(finalMove);
    updateStats();
    updateComboDisplay();
};

window.undo = () => { combo.pop(); updateStats(); updateComboDisplay(); };
window.clearCombo = () => { combo = []; updateStats(); updateComboDisplay(); };

/**
 * 3. 描画ロジック
 */
function drawMoves() {
    const container = document.getElementById("moveList");
    if (!container || !movesData) return;
    
    let html = "";
    // 各カテゴリーをループしてボタンを生成
    const cats = [
        { label: "Normals", data: [...movesData.standing, ...movesData.crouching] },
        { label: "Special Moves", data: movesData.special },
        { label: "Unique Attacks", data: movesData.unique },
        { label: "Super Arts", data: movesData.sa }
    ];

    cats.forEach(cat => {
        html += `<div class="category"><h3>${cat.label}</h3><div class="move-grid">`;
        cat.data.forEach(m => {
            const displayName = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
            const odCls = (isODMode && m.hasOD) ? "od-active" : "";
            // JSONデータを文字列として埋め込む（シングルクォート対策済み）
            const moveJson = JSON.stringify(m).replace(/'/g, "\\'");
            
            html += `<button class="${odCls}" onclick="addMove('${moveJson}')">
                        ${displayName}
                    </button>`;
        });
        html += `</div></div>`;
    });
    container.innerHTML = html;
}

function updateStats() {
    const totalDmg = combo.reduce((s, m) => s + (m.dmg || 0), 0);
    const totalDrive = combo.reduce((s, m) => s + (m.drive || 0), 0);
    document.getElementById("damageCount").innerText = `Damage: ${totalDmg}`;
    document.getElementById("driveCount").innerText = `Drive: -${totalDrive.toFixed(1)}`;
}

function updateComboDisplay() {
    const display = document.getElementById("comboDisplay");
    // renderer.js の関数を呼び出し
    display.innerHTML = renderComboIcons(combo);
}

init();
