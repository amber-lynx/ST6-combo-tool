// app.js
import { renderComboIcons } from './src/modules/renderer.js';

let combo = [];
let isODMode = false;
let isCorner = false;
let movesData = null; // JSONから読み込むデータを保持

// --- 初期化 ---
async function init() {
    try {
        const response = await fetch('./assets/data/move_list.json');
        movesData = await response.json();
        
        applyTheme();
        drawMoves();
        updateStats();
    } catch (e) {
        console.error("データの読み込みに失敗しました:", e);
    }
}

// --- テーマ管理 ---
window.setTheme = (theme) => {
    localStorage.setItem("selectedTheme", theme);
    applyTheme();
};

function applyTheme() {
    const theme = localStorage.getItem("selectedTheme") || "dark";
    document.body.className = 'theme-' + theme;
}

// --- モード切替 ---
window.toggleOD = () => {
    isODMode = !isODMode;
    const btn = document.getElementById("odSwitcher");
    if (btn) {
        btn.classList.toggle("active", isODMode);
        btn.innerHTML = isODMode ? "ODモード: ON 🔥" : "ODモード: OFF";
    }
    drawMoves();
};

window.toggleCorner = () => {
    isCorner = !isCorner;
    const btn = document.getElementById("cornerSwitcher");
    if (btn) {
        btn.classList.toggle("active", isCorner);
        btn.innerText = isCorner ? "場所: 画面端 🧱" : "場所: 中央";
    }
};

// --- 描画ロジック ---
function drawMoves() {
    const container = document.getElementById("moves");
    if (!container || !movesData) return;
    
    let html = "";
    
    // 通常技 (JSONデータを使用するように修正)
    html += `<div class="category"><h3>Normals</h3><div class="standingGrid">`;
    [...movesData.standing, ...movesData.crouching].forEach(m => {
        html += `<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
            <span>${m.name}</span><small>発${m.start}/硬${m.guard > 0 ? '+'+m.guard : (m.guard || '-')}</small>
        </button>`;
    });
    html += `</div></div>`;

    // 必殺技
    html += `<div class="category"><h3>Special Moves</h3><div class="move-grid">`;
    movesData.special.forEach(m => {
        let name = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
        let cls = (isODMode && m.hasOD) ? "class='od-active'" : "";
        html += `<button ${cls} onclick='addMove(${JSON.stringify(m)})'>${name}</button>`;
    });
    html += `</div></div>`;

    // (中略) 他のカテゴリーも同様に movesData を参照して生成
    
    container.innerHTML = html;
}

// --- コンボ操作 ---
window.addMove = (m) => {
    let finalMove = { ...m };
    if (isODMode && m.hasOD) {
        finalMove.name = "OD" + m.name;
        finalMove.dmg = m.odDmg || m.dmg;
        finalMove.gauge = m.odGauge || 0;
    }
    combo.push(finalMove);
    updateStats();
    updateComboDisplay();
    
    // 派生技の処理
    const fContainer = document.getElementById("followupList");
    if (m.followups) {
        fContainer.innerHTML = m.followups.map(f => 
            `<button class="followup-btn active" onclick='addMove(${JSON.stringify(f)})'>${f.name}</button>`
        ).join("");
    } else { fContainer.innerHTML = "派生なし"; }
};

window.undo = () => {
    combo.pop();
    updateStats();
    updateComboDisplay();
    document.getElementById("followupList").innerHTML = "派生なし";
};

window.clearCombo = () => {
    combo = [];
    updateStats();
    updateComboDisplay();
    document.getElementById("followupList").innerHTML = "派生なし";
};

// --- 更新系 ---
function updateStats() {
    const totalDamage = combo.reduce((sum, m) => sum + (m.dmg || 0), 0);
    const totalGauge = combo.reduce((sum, m) => sum + (m.gauge || 0), 0);
    document.getElementById("damageCount").innerText = `Damage: ${totalDamage}`;
    document.getElementById("gaugeCount").innerText = `消費ゲージ: ${totalGauge.toFixed(1)}`;
}

function updateComboDisplay() {
    const container = document.getElementById("combo");
    if (!container) return;
    
    if (combo.length === 0) {
        container.innerHTML = '<span class="placeholder">技を選択...</span>';
        return;
    }

    // ★ここで外部モジュールのアイコン描画を呼び出す
    container.innerHTML = renderComboIcons(combo);
}

// 保存
window.saveComboRoute = () => {
    const name = document.getElementById("comboName").value.trim();
    if (!name || combo.length === 0) return alert("コンボ名を入力してください");
    
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved.push({
        id: Date.now(),
        name,
        damage: combo.reduce((sum, m) => sum + (m.dmg || 0), 0),
        gauge: combo.reduce((sum, m) => sum + (m.gauge || 0), 0),
        situation: isCorner ? "画面端" : "中央",
        route: combo.map(c => c.name)
    });
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    alert("保存完了！");
    clearCombo();
};

// 起動
init();
