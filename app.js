import { renderComboIcons } from './src/modules/renderer.js';

let combo = [];
let isODMode = false;
let isCorner = false;
let movesData = null;

async function init() {
    console.log("1. init開始"); // デバッグ用
    try {
        const response = await fetch('./assets/data/move_list.json');
        console.log("2. fetch応答:", response.status); // 200ならOK
        if (!response.ok) throw new Error(`HTTPエラー! status: ${response.status}`);
        
        movesData = await response.json();
        console.log("3. JSON読み込み成功:", movesData);

        applyTheme();
        drawMoves();
        updateStats();
        updateComboDisplay(); // 初期表示を空にする
    } catch (e) {
        console.error("初期化エラーの詳細:", e);
        const listEl = document.getElementById("moveList");
        if(listEl) listEl.innerHTML = `<p style="color:red">エラー: ${e.message}</p>`;
    }
}

// --- 以下、windowへの登録はそのまま ---
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
    const switcher = document.getElementById("cornerSwitcher");
    if(switcher) {
        switcher.innerText = isCorner ? "場所: 画面端 🧱" : "場所: 中央";
    }
};

window.addMove = (moveStr) => {
    console.log("技追加:", moveStr);
    try {
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
    } catch(e) {
        console.error("addMoveエラー:", e);
    }
};

window.undo = () => { combo.pop(); updateStats(); updateComboDisplay(); };
window.clearCombo = () => { combo = []; updateStats(); updateComboDisplay(); };

function drawMoves() {
    const container = document.getElementById("moveList");
    if (!container || !movesData) return;
    
    let html = "";
    const cats = [
        { label: "Normals", data: [...(movesData.standing || []), ...(movesData.crouching || [])] },
        { label: "Special Moves", data: movesData.special || [] },
        { label: "Unique Attacks", data: movesData.unique || [] },
        { label: "Super Arts", data: movesData.sa || [] }
    ];

    cats.forEach(cat => {
        html += `<div class="category"><h3>${cat.label}</h3><div class="move-grid">`;
        cat.data.forEach(m => {
            const displayName = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
            const odCls = (isODMode && m.hasOD) ? "od-active" : "";
            const moveJson = JSON.stringify(m).replace(/'/g, "\\'");
            html += `<button class="${odCls}" onclick="addMove('${moveJson}')">${displayName}</button>`;
        });
        html += `</div></div>`;
    });
    container.innerHTML = html;
}

function updateStats() {
    const totalDmg = combo.reduce((s, m) => s + (m.dmg || 0), 0);
    const totalDrive = combo.reduce((s, m) => s + (m.drive || 0), 0);
    const dmgEl = document.getElementById("damageCount");
    const driveEl = document.getElementById("driveCount");
    if(dmgEl) dmgEl.innerText = `Damage: ${totalDmg}`;
    if(driveEl) driveEl.innerText = `Drive: -${totalDrive.toFixed(1)}`;
}

function updateComboDisplay() {
    const display = document.getElementById("comboDisplay");
    if(display) display.innerHTML = renderComboIcons(combo);
}

// 最後に実行
init();
