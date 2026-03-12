import { renderComboIcons } from './src/modules/renderer.js';

let combo = [];
let isODMode = false;
let isCorner = false;
let movesData = null;

async function init() {
    try {
        const response = await fetch('./assets/data/move_list.json');
        if (!response.ok) throw new Error("JSONが見つかりません");
        movesData = await response.json();
        
        applyTheme();
        drawMoves(); // ここでJSから安全にボタンを作る
        updateStats();
        loadFromUrl();
        console.log("App Initialized successfully");
    } catch (e) {
        console.error("初期化エラー:", e);
    }
}

// 技の追加：引数は「文字」ではなく「オブジェクト」として受け取る
window.addMove = (moveObj) => {
    if (!moveObj) return;
    try {
        // 文字列なら変換するが、基本はそのまま使う
        const m = (typeof moveObj === 'string') ? JSON.parse(moveObj) : moveObj;
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
        scrollToEnd();
    } catch(e) {
        console.error("addMove Error:", e);
    }
};

function drawMoves() {
    const container = document.getElementById("moveList");
    if (!container || !movesData) return;
    
    container.innerHTML = ""; // 古いボタンを完全に消去

    const cats = [
        { id: "normal", label: "Normals (通常技)", data: [...(movesData.standing || []), ...(movesData.crouching || [])] },
        { id: "unique", label: "Unique Attacks (特殊技)", data: movesData.unique || [] },
        { id: "special", label: "Special Moves (必殺技)", data: movesData.special || [], hasFollowupSlot: true },
        { id: "super", label: "Super Arts (SA)", data: movesData.sa || [] },
        { id: "system", label: "System (システム)", data: movesData.system || [] }
    ];

    cats.forEach(cat => {
        const catDiv = document.createElement("div");
        catDiv.className = "category";
        catDiv.setAttribute("data-category", cat.id);
        
        const title = document.createElement("h3");
        title.innerText = cat.label;
        catDiv.appendChild(title);
        
        const gridDiv = document.createElement("div");
        gridDiv.className = "move-grid";
        
        cat.data.forEach(m => {
            const btn = document.createElement("button");
            const displayName = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
            if (isODMode && m.hasOD) btn.className = "od-active";
            
            btn.innerHTML = `<span>${displayName}</span>${m.start ? `<small>発${m.start}</small>` : ''}`;
            
            // 重要：HTMLのonclickは絶対に使わず、JSでクリックイベントを貼る
            btn.addEventListener("click", () => window.addMove(m));
            
            gridDiv.appendChild(btn);
        });
        
        catDiv.appendChild(gridDiv);
        container.appendChild(catDiv);
        
        if (cat.hasFollowupSlot) {
            const fDiv = document.createElement("div");
            fDiv.className = "category highlight";
            fDiv.setAttribute("data-category", "followup");
            fDiv.innerHTML = `<h3>Followups (派生技)</h3><div id="followupList" class="followup-grid">派生なし</div>`;
            container.appendChild(fDiv);
        }
    });
}

function updateFollowups(move) {
    const fContainer = document.getElementById("followupList");
    if (!fContainer) return;

    if (move.followups && move.followups.length > 0) {
        fContainer.innerHTML = ""; 
        move.followups.forEach(f => {
            const btn = document.createElement("button");
            btn.className = "followup-btn active";
            btn.innerText = f.name;
            btn.addEventListener("click", () => window.addMove(f));
            fContainer.appendChild(btn);
        });
    } else {
        fContainer.innerHTML = "派生なし";
    }
}

// その他の共通関数
window.setTheme = (t) => { localStorage.setItem("selectedTheme", t); applyTheme(); };
function applyTheme() { document.body.className = 'theme-' + (localStorage.getItem("selectedTheme") || "dark"); }
window.toggleOD = () => { isODMode = !isODMode; const b = document.getElementById("odSwitcher"); if(b){ b.classList.toggle("active", isODMode); b.innerText = isODMode ? "ODモード: ON 🔥" : "ODモード: OFF"; } drawMoves(); };
window.undo = () => { combo.pop(); updateStats(); updateComboDisplay(); scrollToEnd(); };
window.clearCombo = () => { combo = []; updateStats(); updateComboDisplay(); };
function updateStats() {
    const d = combo.reduce((s, m) => s + (m.dmg || 0), 0);
    const g = combo.reduce((s, m) => s + (m.drive || 0), 0);
    if(document.getElementById("damageCount")) document.getElementById("damageCount").innerText = `Damage: ${d}`;
    if(document.getElementById("driveCount")) document.getElementById("driveCount").innerText = `Drive: -${g.toFixed(1)}`;
}
function updateComboDisplay() {
    const d = document.getElementById("comboDisplay");
    if(d) d.innerHTML = renderComboIcons(combo);
}
function scrollToEnd() {
    const d = document.getElementById("comboDisplay");
    if(d) setTimeout(() => { d.scrollTo({ left: d.scrollWidth, behavior: 'smooth' }); }, 50);
}
init();
