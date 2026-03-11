let combo = [];
let isODMode = false;
let totalDamage = 0;
let totalGauge = 0; // 消費ゲージ
let isCorner = false; // 画面端設定

const iconMap = {
    "弱P": "icons/LP.png", "中P": "icons/MP.png", "強P": "icons/HP.png",
    "弱K": "icons/LK.png", "中K": "icons/MK.png", "強K": "icons/HK.png"
};

const moves = {
    standing: [
        { name: "弱P", cmd: "LP", dmg: 300, frame: "発生4/ガド-2" },
        { name: "中P", cmd: "MP", dmg: 600, frame: "発生6/ガド+2" },
        { name: "強P", cmd: "HP", dmg: 800, frame: "発生10/ガド-3" },
        { name: "弱K", cmd: "LK", dmg: 300, frame: "発生4/ガド-3" },
        { name: "中K", cmd: "MK", dmg: 700, frame: "発生8/ガド-4" },
        { name: "強K", cmd: "HK", dmg: 900, frame: "発生12/ガド-3" },
    ],
    special: [
        { name: "武神旋風脚", cmd: "214K", odCmd: "214KK", hasOD: true, dmg: 1000, odDmg: 1200, gauge: 0, odGauge: 2, frame: "対空/コンボ用" },
        { name: "流転一文字", cmd: "236P", odCmd: "236PP", hasOD: true, dmg: 1000, odDmg: 1200, gauge: 0, odGauge: 2, frame: "突進技" },
        { 
            name: "疾駆け", cmd: "214K", odCmd: "214KK", hasOD: true, gauge: 0, odGauge: 2,
            followups: [
                { name: "影すくい", cmd: "2K", dmg: 800 },
                { name: "弧空", cmd: "8", followups: [
                    { name: "武神イズナ落とし", cmd: "P", dmg: 1500 }
                ]}
            ]
        },
        { name: "召雷細工", cmd: "22P", followups: [{ name: "細工手裏剣", dmg: 200 }] }
    ],
    system: [
        { name: "インパクト", cmd: "HP+HK", dmg: 800, gauge: 1 },
        { name: "ラッシュ(生)", cmd: "66", gauge: 1 },
        { name: "ラッシュ(取消)", cmd: "66", gauge: 3 }
    ],
    sa: [
        { name: "SA1 武神乱拍手", dmg: 2100 },
        { name: "SA2 武神天翔亢竜", dmg: 3000 },
        { name: "SA3 武神顕現神楽", dmg: 4000 }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    drawMoves();
});

function setTheme(theme) { localStorage.setItem("selectedTheme", theme); applyTheme(); }
function applyTheme() { document.body.className = 'theme-' + (localStorage.getItem("selectedTheme") || "dark"); }

function toggleOD() {
    isODMode = !isODMode;
    document.getElementById("odSwitcher").classList.toggle("active", isODMode);
    drawMoves();
}

function toggleCorner() {
    isCorner = !isCorner;
    const btn = document.getElementById("cornerSwitcher");
    btn.classList.toggle("active", isCorner);
    btn.innerText = isCorner ? "場所: 画面端 🧱" : "場所: 中央";
}

function drawMoves() {
    const container = document.getElementById("moves");
    let html = `<div class="category"><h3>Normals</h3><div class="standingGrid">`;
    [...moves.standing].forEach(m => {
        html += `<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'><span>${m.name}</span><small>${m.frame || ''}</small></button>`;
    });
    html += `</div></div>`;

    html += `<div class="category"><h3>Special / Drive</h3><div class="move-grid">`;
    moves.special.forEach(m => {
        let name = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
        html += `<button class="${(isODMode && m.hasOD) ? 'od-active' : ''}" onclick='addMove(${JSON.stringify(m)})'>${name}</button>`;
    });
    moves.system.forEach(m => {
        html += `<button class="system-btn" onclick='addMove(${JSON.stringify(m)})'>${m.name}</button>`;
    });
    html += `</div></div>`;
    
    html += `<div class="category highlight"><h3>Followups</h3><div id="followupList" class="followup-grid">派生なし</div></div>`;
    html += drawSection("Super Arts", moves.sa);
    container.innerHTML = html;
}

function drawSection(title, list) {
    let html = `<div class="category"><h3>${title}</h3><div class="move-grid">`;
    list.forEach(m => { html += `<button onclick='addMove(${JSON.stringify(m)})'>${m.name}</button>`; });
    html += `</div></div>`;
    return html;
}

function addMove(m) {
    let finalMove = { ...m };
    if (isODMode && m.hasOD) {
        finalMove.name = "OD" + m.name;
        finalMove.dmg = m.odDmg;
        finalMove.gauge = m.odGauge;
    }
    combo.push(finalMove);
    updateStats();
    updateComboDisplay();
    
    const fContainer = document.getElementById("followupList");
    if (m.followups) {
        fContainer.innerHTML = m.followups.map(f => `<button class="followup-btn active" onclick='addMove(${JSON.stringify(f)})'>${f.name}</button>`).join("");
    } else { fContainer.innerHTML = "派生なし"; }
}

function updateStats() {
    totalDamage = combo.reduce((sum, m) => sum + (m.dmg || 0), 0);
    totalGauge = combo.reduce((sum, m) => sum + (m.gauge || 0), 0);
    document.getElementById("damageCount").innerText = `Damage: ${totalDamage}`;
    document.getElementById("gaugeCount").innerText = `消費ゲージ: ${totalGauge.toFixed(1)}`;
    document.getElementById("gaugeCount").style.color = totalGauge > 6 ? "#ff4444" : "#58a6ff";
}

function updateComboDisplay() {
    const container = document.getElementById("combo");
    container.innerHTML = combo.map((m, i) => `<span class="combo-unit">${m.name}${i < combo.length - 1 ? '<span class="arrow">→</span>' : ''}</span>`).join("");
}

function undo() { combo.pop(); updateStats(); updateComboDisplay(); }
function clearCombo() { combo = []; totalDamage = 0; totalGauge = 0; updateStats(); updateComboDisplay(); }

function saveComboRoute() {
    const name = document.getElementById("comboName").value.trim();
    if (!name || combo.length === 0) return alert("名前を入力してください");
    const memo = prompt("メモ（例：最速入力、微歩き）", "");
    const video = prompt("動画URL（YouTube/Xなど）", "");
    
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved.push({ 
        id: Date.now(), name, damage: totalDamage, gauge: totalGauge, 
        situation: isCorner ? "画面端" : "中央", 
        memo, video, route: combo.map(c => c.name) 
    });
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    alert("保存完了！");
    clearCombo();
}
