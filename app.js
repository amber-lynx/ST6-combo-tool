import { renderComboIcons } from './src/modules/renderer.js';

let combo = [];
let isODMode = false;
let isCorner = false;
let movesData = null;

/**
 * データの初期読み込み
 */
async function init() {
    try {
        const response = await fetch('./assets/data/move_list.json');
        if (!response.ok) throw new Error("JSON読み込みエラー");
        movesData = await response.json();
        
        applyTheme();
        drawMoves();
        updateStats();
    } catch (e) {
        console.error(e);
        alert("データの読み込みに失敗しました。フォルダ構成を確認してください。");
    }
}

/**
 * 技ボタンの描画
 */
function drawMoves() {
    const container = document.getElementById("moveList");
    if (!container || !movesData) return;
    
    let html = "";
    const categories = [
        { label: "Normals", data: [...movesData.standing, ...movesData.crouching], grid: "standingGrid" },
        { label: "Special Moves", data: movesData.special, grid: "move-grid", isSpecial: true },
        { label: "Unique Attacks", data: movesData.unique, grid: "move-grid" },
        { label: "SA / System", data: [...movesData.sa, ...movesData.system], grid: "move-grid" }
    ];

    categories.forEach(cat => {
        html += `<div class="category"><h3>${cat.label}</h3><div class="${cat.grid}">`;
        cat.data.forEach(m => {
            const displayName = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
            const odCls = (isODMode && m.hasOD) ? "od-active" : "";
            const moveJson = JSON.stringify(m).replace(/'/g, "\\'");

            html += `<button class="${odCls}" onclick="addMove('${moveJson}')">
                        <span>${displayName}</span>
                        ${m.start ? `<small>発${m.start}</small>` : ''}
                    </button>`;
        });
        html += `</div></div>`;
        if (cat.isSpecial) {
            html += `<div class="category highlight"><h3>Followups (派生)</h3><div id="followupList" class="followup-grid">派生なし</div></div>`;
        }
    });
    container.innerHTML = html;
}

/**
 * グローバル関数の登録 (HTMLのonclickから呼ぶため)
 */
window.addMove = (moveStr) => {
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

    // 派生表示
    const fList = document.getElementById("followupList");
    if (m.followups) {
        fList.innerHTML = m.followups.map(f => {
            const fJson = JSON.stringify(f).replace(/'/g, "\\'");
            return `<button onclick="addMove('${fJson}')">${f.name}</button>`;
        }).join("");
    } else { fList.innerHTML = "派生なし"; }
};

window.toggleOD = () => {
    isODMode = !isODMode;
    const btn = document.getElementById("odSwitcher");
    btn.classList.toggle("active", isODMode);
    btn.innerText = isODMode ? "ODモード: ON 🔥" : "ODモード: OFF";
    drawMoves();
};

window.toggleCorner = () => {
    isCorner = !isCorner;
    const btn = document.getElementById("cornerSwitcher");
    btn.innerText = isCorner ? "場所: 画面端 🧱" : "場所: 中央";
};

window.undo = () => { combo.pop(); updateStats(); updateComboDisplay(); };
window.clearCombo = () => { combo = []; updateStats(); updateComboDisplay(); };

window.setTheme = (theme) => {
    localStorage.setItem("selectedTheme", theme);
    applyTheme();
};

function applyTheme() {
    const theme = localStorage.getItem("selectedTheme") || "dark";
    document.body.className = 'theme-' + theme;
}

function updateStats() {
    const totalDmg = combo.reduce((s, m) => s + (m.dmg || 0), 0);
    const totalDrive = combo.reduce((s, m) => s + (m.drive || 0), 0);
    document.getElementById("damageCount").innerText = `Damage: ${totalDmg}`;
    document.getElementById("driveCount").innerText = `Drive: -${totalDrive.toFixed(1)}`;
}

function updateComboDisplay() {
    const display = document.getElementById("comboDisplay");
    display.innerHTML = renderComboIcons(combo);
}

window.copyShareUrl = () => {
    const data = btoa(encodeURIComponent(JSON.stringify(combo.map(m => m.name))));
    const url = `${window.location.origin}${window.location.pathname}?c=${data}`;
    navigator.clipboard.writeText(url);
    alert("共有URLをコピーしました！");
};

init();
