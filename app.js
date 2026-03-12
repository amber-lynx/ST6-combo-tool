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
        
        window.applyTheme();
        window.drawMoves();
        window.updateStats();
        console.log("App Initialized successfully");
    } catch (e) {
        console.error("初期化エラー:", e);
    }
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
    window.updateFollowups(m);
    window.scrollToEnd();
};

// 描画
window.drawMoves = () => {
    const container = document.getElementById("moveList");
    if (!container || !movesData) return;
    container.innerHTML = ""; 

    const cats = [
        { id: "normal", label: "通常技", data: [...(movesData.standing || []), ...(movesData.crouching || [])] },
        { id: "unique", label: "特殊技", data: movesData.unique || [] },
        { id: "special", label: "必殺技", data: movesData.special || [], hasFollowup: true },
        { id: "super", label: "SA", data: movesData.sa || [] },
        { id: "system", label: "システム", data: movesData.system || [] }
    ];

    cats.forEach(cat => {
        const catDiv = document.createElement("div");
        catDiv.className = "category";
        catDiv.setAttribute("data-category", cat.id);
        catDiv.innerHTML = `<h3>${cat.label}</h3>`;
        
        const grid = document.createElement("div");
        grid.className = "move-grid";
        
        cat.data.forEach(m => {
            const btn = document.createElement("button");
            const name = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
            if (isODMode && m.hasOD) btn.className = "od-active";
            btn.innerHTML = `<span>${name}</span>${m.start ? `<small>発${m.start}</small>` : ''}`;
            btn.addEventListener("click", () => window.addMove(m));
            grid.appendChild(btn);
        });
        catDiv.appendChild(grid);
        container.appendChild(catDiv);
        
        if (cat.hasFollowup) {
            const fDiv = document.createElement("div");
            fDiv.className = "category highlight";
            fDiv.setAttribute("data-category", "followup");
            fDiv.innerHTML = `<h3>派生技</h3><div id="followupList" class="followup-grid">派生なし</div>`;
            container.appendChild(fDiv);
        }
    });
};

window.updateFollowups = (move) => {
    const fList = document.getElementById("followupList");
    if (!fList) return;
    if (move.followups && move.followups.length > 0) {
        fList.innerHTML = "";
        move.followups.forEach(f => {
            const btn = document.createElement("button");
            btn.className = "followup-btn active";
            btn.innerText = f.name;
            btn.addEventListener("click", () => window.addMove(f));
            fList.appendChild(btn);
        });
    } else {
        fList.innerHTML = "派生なし";
    }
};

// --- 共通ボタン機能 ---
window.setTheme = (t) => { localStorage.setItem("theme", t); window.applyTheme(); };
window.applyTheme = () => { document.body.className = 'theme-' + (localStorage.getItem("theme") || "dark"); };
window.toggleOD = () => { 
    isODMode = !isODMode; 
    const b = document.getElementById("odSwitcher"); 
    if(b) b.innerText = isODMode ? "OD: ON 🔥" : "OD: OFF"; 
    if(b) b.classList.toggle("active", isODMode);
    window.drawMoves(); 
};
window.toggleCorner = () => {
    isCorner = !isCorner;
    const b = document.getElementById("cornerSwitcher");
    if(b) b.innerText = isCorner ? "場所: 画面端 🧱" : "場所: 中央";
    if(b) b.classList.toggle("active", isCorner);
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
