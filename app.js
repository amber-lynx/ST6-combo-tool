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
        
        // URLからのコンボ読み込み機能（共有リンク対応）
        loadFromUrl();
        console.log("App Initialized successfully");
    } catch (e) {
        console.error("初期化エラー:", e);
        const listEl = document.getElementById("moveList");
        if(listEl) listEl.innerHTML = "<p>データの読み込みに失敗しました。パスを確認してください。</p>";
    }
}

/**
 * 2. グローバル関数 (window登録)
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
        btn.classList.toggle("active", isCorner);
    }
};

// 技の追加
window.addMove = (moveStr) => {
    try {
        const m = typeof moveStr === 'string' ? JSON.parse(moveStr) : moveStr;
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
        updateFollowups(m);
        
        // プロSE仕様：追加時に自動スクロール
        scrollToEnd();
    } catch(e) {
        console.error("addMove Error:", e);
    }
};

window.undo = () => { 
    combo.pop(); 
    updateStats(); 
    updateComboDisplay(); 
    const fList = document.getElementById("followupList");
    if(fList) fList.innerHTML = "派生なし";
    scrollToEnd();
};

window.clearCombo = () => { 
    combo = []; 
    updateStats(); 
    updateComboDisplay(); 
    const fList = document.getElementById("followupList");
    if(fList) fList.innerHTML = "派生なし";
};

/**
 * 3. 描画ロジック（横スクロール・カテゴリー対応版）
 */
function drawMoves() {
    const container = document.getElementById("moveList");
    if (!container || !movesData) return;
    
    let html = "";
    // カテゴリーIDをHTML側のジャンプ用ボタン(scrollToCategory)と一致させる
    const cats = [
        { id: "normal", label: "Normals (通常技)", data: [...(movesData.standing || []), ...(movesData.crouching || [])], grid: "standingGrid" },
        { id: "unique", label: "Unique Attacks (特殊技)", data: movesData.unique || [], grid: "move-grid" },
        { id: "special", label: "Special Moves (必殺技)", data: movesData.special || [], grid: "move-grid", hasFollowupSlot: true },
        { id: "super", label: "Super Arts (SA)", data: movesData.sa || [], grid: "move-grid" },
        { id: "system", label: "System (システム)", data: movesData.system || [], grid: "move-grid" }
    ];

    cats.forEach(cat => {
        // プロSE仕様：data-category属性を付与してジャンプ可能に
        html += `<div class="category" data-category="${cat.id}"><h3>${cat.label}</h3><div class="${cat.grid || 'move-grid'}">`;
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
        
        if (cat.hasFollowupSlot) {
            html += `<div class="category highlight" data-category="followup"><h3>Followups (派生技)</h3><div id="followupList" class="followup-grid">派生なし</div></div>`;
        }
    });
    container.innerHTML = html;
}

function updateFollowups(move) {
    const fContainer = document.getElementById("followupList");
    if (!fContainer) return;

    if (move.followups && move.followups.length > 0) {
        fContainer.innerHTML = move.followups.map(f => {
            const fJson = JSON.stringify(f).replace(/'/g, "\\'");
            return `<button class="followup-btn active" onclick="addMove('${fJson}')">${f.name}</button>`;
        }).join("");
    } else {
        fContainer.innerHTML = "派生なし";
    }
}

/**
 * 4. ステータス・表示更新
 */
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
    if(display) {
        display.innerHTML = renderComboIcons(combo);
    }
}

// プロSE仕様：コンボ欄を右端へオートスクロール
function scrollToEnd() {
    const display = document.getElementById("comboDisplay");
    if(display) {
        setTimeout(() => {
            display.scrollTo({
                left: display.scrollWidth,
                behavior: 'smooth'
            });
        }, 50);
    }
}

/**
 * 5. 共有・読み込み
 */
window.copyShareUrl = () => {
    try {
        const comboData = combo.map(m => ({ name: m.name, cmd: m.cmd, dmg: m.dmg }));
        const data = btoa(encodeURIComponent(JSON.stringify(comboData)));
        const url = `${window.location.origin}${window.location.pathname}?c=${data}`;
        navigator.clipboard.writeText(url).then(() => alert("共有URLをコピーしました！"));
    } catch (e) {
        alert("URLの作成に失敗しました。");
    }
};

function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('c');
    if (data) {
        try {
            const decoded = JSON.parse(decodeURIComponent(atob(data)));
            combo = decoded;
            updateStats();
            updateComboDisplay();
        } catch (e) {
            console.error("URL読み込みエラー");
        }
    }
}

init();
