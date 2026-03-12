// app.js
import { renderComboIcons } from './src/modules/renderer.js';

// --- 状態管理 (State) ---
let combo = [];
let isODMode = false;
let isCorner = false;
let movesData = null; 

// --- 1. アプリの初期化 (Initialization) ---
async function initApp() {
    try {
        // JSONデータを読み込む
        const response = await fetch('./assets/data/move_list.json');
        if (!response.ok) throw new Error("JSON読み込み失敗");
        movesData = await response.json();
        
        applyTheme();
        drawMoves();
        updateStats();
        console.log("App Initialized with moves:", movesData);
    } catch (error) {
        console.error("初期化エラー:", error);
        alert("データの読み込みに失敗しました。フォルダ構成を確認してください。");
    }
}

// --- 2. テーマ・モード切り替え ---
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
    if (btn) {
        btn.classList.toggle("active", isODMode);
        btn.innerHTML = isODMode ? "ODモード: ON 🔥" : "ODモード: OFF";
    }
    drawMoves(); // ボタンの表示（名前）を更新
};

window.toggleCorner = () => {
    isCorner = !isCorner;
    const btn = document.getElementById("cornerSwitcher");
    if (btn) {
        btn.classList.toggle("active", isCorner);
        btn.innerText = isCorner ? "場所: 画面端 🧱" : "場所: 中央";
    }
};

// --- 3. 技ボタンの描画 (Rendering Buttons) ---
function drawMoves() {
    const container = document.getElementById("moves");
    if (!container || !movesData) return;
    
    let html = "";
    
    // カテゴリごとの描画設定
    const categories = [
        { label: "Normals", data: [...movesData.standing, ...movesData.crouching], className: "standingGrid" },
        { label: "Special Moves", data: movesData.special, className: "move-grid" },
        { label: "Unique Attacks", data: movesData.unique, className: "move-grid" },
        { label: "Throws", data: movesData.throws, className: "move-grid" },
        { label: "Super Arts", data: movesData.sa, className: "move-grid", btnClass: "sa-btn" },
        { label: "System", data: movesData.system, className: "move-grid", btnClass: "system-btn" }
    ];

    categories.forEach(cat => {
        html += `<div class="category"><h3>${cat.label}</h3><div class="${cat.className}">`;
        cat.data.forEach(m => {
            let displayName = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
            let activeCls = (isODMode && m.hasOD) ? "od-active" : "";
            let extraInfo = m.start ? `<small>発${m.start}/硬${m.guard || '-'}</small>` : "";
            
            // 引数として渡すために文字列化
            const moveJson = JSON.stringify(m).replace(/'/g, "\\'");
            
            html += `
                <button class="${cat.btnClass || ''} ${activeCls}" onclick="addMove('${moveJson}')">
                    <span>${displayName}</span>${extraInfo}
                </button>`;
        });
        html += `</div></div>`;
        
        // 必殺技の後に派生枠を挿入
        if (cat.label === "Special Moves") {
            html += `<div class="category highlight"><h3>Followups (派生技)</h3><div id="followupList" class="followup-grid">派生なし</div></div>`;
        }
    });
    
    container.innerHTML = html;
}

// --- 4. コンボ操作 (Combo Logic) ---
window.addMove = (moveStr) => {
    // 文字列をオブジェクトに戻す
    const m = JSON.parse(moveStr);
    
    let finalMove = { ...m };
    if (isODMode && m.hasOD) {
        finalMove.name = "OD" + m.name;
        finalMove.dmg = m.odDmg || m.dmg;
        finalMove.gauge = m.odGauge || 0;
    }
    
    combo.push(finalMove);
    updateStats();
    updateComboDisplay();
    
    // 派生技ボタンの更新
    const fContainer = document.getElementById("followupList");
    if (m.followups) {
        fContainer.innerHTML = m.followups.map(f => {
            const fJson = JSON.stringify(f).replace(/'/g, "\\'");
            return `<button class="followup-btn active" onclick="addMove('${fJson}')">${f.name}</button>`;
        }).join("");
    } else {
        fContainer.innerHTML = "派生なし";
    }
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

// --- 5. 画面更新 (UI Update) ---
function updateStats() {
    const totalDamage = combo.reduce((sum, m) => sum + (m.dmg || 0), 0);
    const totalGauge = combo.reduce((sum, m) => sum + (m.gauge || 0), 0);
    document.getElementById("damageCount").innerText = `Damage: ${totalDamage}`;
    document.getElementById("gaugeCount").innerText = `消費ゲージ: ${totalGauge.toFixed(1)}`;
}

function updateComboDisplay() {
    const container = document.getElementById("combo"); // HTML側のIDに合わせる
    if (!container) return;
    
    if (combo.length === 0) {
        container.innerHTML = '<span class="placeholder">技を選択...</span>';
        return;
    }

    // 外部モジュールのレンダラーを使用
    container.innerHTML = renderComboIcons(combo);
}

// --- 6. 保存機能 ---
window.saveComboRoute = () => {
    const name = document.getElementById("comboName").value.trim();
    if (!name || combo.length === 0) return alert("コンボ名を入力し、技を選択してください");
    
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
    alert("コンボをローカルに保存しました！");
    clearCombo();
};

// アプリ起動
initApp();
