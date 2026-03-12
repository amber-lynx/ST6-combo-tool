import { renderComboIcons, renderMoveList } from './src/modules/renderer.js';

let combo = [];
let isODMode = false;
let isCorner = false;
let movesData = null;

async function init() {
    try {
        const response = await fetch('./assets/data/move_list.json');
        if (!response.ok) throw new Error("JSONが見つかりません");
        movesData = await response.json();
        
        window.applyTheme();
        // renderer.jsの描画関数を呼び出す
        renderMoveList(combineMoves(movesData), window.addMove);
        window.updateStats();
        console.log("App Initialized successfully");
    } catch (e) {
        console.error("初期化エラー:", e);
    }
}

// データの整形（通常技をまとめる）
function combineMoves(data) {
    return [
        ...(data.standing || []),
        ...(data.crouching || []),
        ...(data.unique || []),
        ...(data.special || []),
        ...(data.sa || []),
        ...(data.system || [])
    ];
}

// 技の追加
window.addMove = (m) => {
    if (!m) return;
    let finalMove = { ...m };
    if (isODMode && m.hasOD) {
        finalMove.name = "OD" + m.name;
        finalMove.dmg = m.odDmg || m.dmg;
        finalMove.drive = m.odGauge || 0;
    } else {
        finalMove.drive = m.gauge || 0;
    }
    combo.push(finalMove);
    window.updateStats();
    window.updateComboDisplay();
    // 派生技がある場合の処理（必要に応じて）
    window.scrollToEnd();
};

// --- 共通ボタン機能（windowに登録してHTMLから呼べるようにする） ---
window.setTheme = (t) => { localStorage.setItem("theme", t); window.applyTheme(); };
window.applyTheme = () => { document.body.className = 'theme-' + (localStorage.getItem("theme") || "dark"); };
window.toggleOD = () => { 
    isODMode = !isODMode; 
    const b = document.getElementById("odSwitcher"); 
    if(b) b.innerText = isODMode ? "OD: ON 🔥" : "OD: OFF"; 
    if(b) b.classList.toggle("active", isODMode);
};
window.toggleCorner = () => {
    isCorner = !isCorner;
    const b = document.getElementById("cornerSwitcher");
    if(b) b.innerText = isCorner ? "場所: 端 🧱" : "場所: 中央";
};
window.undo = () => { combo.pop(); window.updateStats(); window.updateComboDisplay(); };
window.clearCombo = () => { combo = []; window.updateStats(); window.updateComboDisplay(); };

window.updateStats = () => {
    const d = combo.reduce((s, m) => s + (m.dmg || 0), 0);
    const dmgEl = document.getElementById("damageCount");
    if(dmgEl) dmgEl.innerText = `Damage: ${d}`;
};

window.updateComboDisplay = () => {
    const d = document.getElementById("comboDisplay");
    if(d) d.innerHTML = renderComboIcons(combo);
};

window.scrollToEnd = () => {
    const d = document.getElementById("comboDisplay");
    if(d) setTimeout(() => d.scrollTo({ left: d.scrollWidth, behavior: 'smooth' }), 50);
};

init();
