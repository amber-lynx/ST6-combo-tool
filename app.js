let combo = [];
let isODMode = false;
let totalDamage = 0;
let totalGauge = 0;
let isCorner = false;

const iconMap = {
    "弱P": "icons/LP.png", "中P": "icons/MP.png", "強P": "icons/HP.png",
    "弱K": "icons/LK.png", "中K": "icons/MK.png", "強K": "icons/HK.png"
};

const moves = {
    standing: [
        { name: "弱P", cmd: "LP", dmg: 300, start: 4, guard: -2 },
        { name: "中P", cmd: "MP", dmg: 600, start: 6, guard: 2 },
        { name: "強P", cmd: "HP", dmg: 800, start: 10, guard: -3 },
        { name: "弱K", cmd: "LK", dmg: 300, start: 4, guard: -3 },
        { name: "中K", cmd: "MK", dmg: 700, start: 8, guard: -4 },
        { name: "強K", cmd: "HK", dmg: 900, start: 12, guard: -3 },
    ],
    crouching: [
        { name: "屈弱P", cmd: "2LP", dmg: 300, start: 4, guard: -2 },
        { name: "屈中P", cmd: "2MP", dmg: 600, start: 6, guard: 1 },
        { name: "屈強P", cmd: "2HP", dmg: 800, start: 9, guard: -10 },
        { name: "屈弱K", cmd: "2LK", dmg: 300, start: 5, guard: -2 },
        { name: "屈中K", cmd: "2MK", dmg: 700, start: 8, guard: -5 },
        { name: "屈強K", cmd: "2HK", dmg: 900, start: 10, guard: -11 },
    ],
    special: [
        { name: "武神旋風脚", cmd: "214K", odCmd: "214KK", hasOD: true, dmg: 1000, odDmg: 1200, gauge: 0, odGauge: 2 },
        { name: "空中武神旋風脚", cmd: "j214K", odCmd: "j214KK", hasOD: true, dmg: 800, odDmg: 1000, gauge: 0, odGauge: 2 },
        { 
            name: "疾駆け", cmd: "214K", odCmd: "214KK", hasOD: true, gauge: 0, odGauge: 2,
            followups: [
                { name: "急停止", cmd: "P", dmg: 0 },
                { name: "胴刎ね", cmd: "K", dmg: 800 },
                { name: "影すくい", cmd: "2K", dmg: 800 },
                { name: "首狩り", cmd: "6K", dmg: 900 },
                { name: "弧空", cmd: "8", followups: [
                    { name: "武神イズナ落とし", cmd: "P", dmg: 1500 },
                    { name: "武神鉾刃脚", cmd: "K", dmg: 1200 }
                ]}
            ]
        },
        { name: "流転一文字", cmd: "236P", odCmd: "236PP", hasOD: true, dmg: 1000, odDmg: 1200, gauge: 0, odGauge: 2 },
        { name: "彩隠形", cmd: "214P", odCmd: "214PP", hasOD: true, dmg: 0, odGauge: 2 },
        { 
            name: "召雷細工", cmd: "22P", dmg: 0,
            followups: [
                { name: "細工手裏剣", cmd: "22P", dmg: 200 },
                { name: "乱れ細工手裏剣", cmd: "22PP", dmg: 400, gauge: 2 }
            ]
        },
        { name: "荒鵺捻り", cmd: "j236P", odCmd: "j236PP", hasOD: true, dmg: 1300, odDmg: 1500, gauge: 0, odGauge: 2 }
    ],
    unique: [
        { name: "肘落とし(前J)", cmd: "j2MP", dmg: 600 },
        { name: "武神虎連牙", cmd: "MP>HP", dmg: 1200 },
        { name: "武神天架拳", cmd: "LP>MP>HP>HK", dmg: 1800 },
        { name: "武神獄鎖拳", cmd: "LP>MP>2HP>HK", dmg: 1700 }
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
    updateStats();
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
    let html = `<div class="category"><h3>Normals (Stand/Crouch)</h3><div class="standingGrid">`;
    [...moves.standing, ...moves.crouching].forEach(m => {
        html += `<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
            <img src="${getIcon(m.name)}" onerror="this.style.display='none'">
            <span>${m.name}</span><small>発${m.start}/硬${m.guard > 0 ? '+'+m.guard : m.guard}</small>
        </button>`;
    });
    html += `</div></div>`;

    html += `<div class="category"><h3>Special Moves</h3><div class="move-grid">`;
    moves.special.forEach(m => {
        let name = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
        let cls = (isODMode && m.hasOD) ? "class='od-active'" : "";
        html += `<button ${cls} onclick='addMove(${JSON.stringify(m)})'>${name}</button>`;
    });
    html += `</div></div>`;

    html += `<div class="category highlight"><h3>Followups (派生技)</h3><div id="followupList" class="followup-grid">派生なし</div></div>`;
    html += drawSection("Super Arts / System", [...moves.sa, ...moves.unique, ...moves.system]);
    container.innerHTML = html;
}

function drawSection(title, list) {
    let html = `<div class="category"><h3>${title}</h3><div class="move-grid">`;
    list.forEach(m => { html += `<button onclick='addMove(${JSON.stringify(m)})'>${m.name}</button>`; });
    html += `</div></div>`;
    return html;
}

function getIcon(name) {
    for (let key in iconMap) { if (name.includes(key)) return iconMap[key]; }
    return "";
}

function addMove(m) {
    let finalMove = { ...m };
    if (isODMode && m.hasOD) {
        finalMove.name = "OD" + m.name;
        finalMove.dmg = m.odDmg || m.dmg;
        finalMove.gauge = m.odGauge || m.gauge;
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
    const gCount = document.getElementById("gaugeCount");
    gCount.innerText = `消費ゲージ: ${totalGauge.toFixed(1)}`;
    gCount.style.color = totalGauge > 6 ? "#ff4444" : "#58a6ff";
}

function updateComboDisplay() {
    const container = document.getElementById("combo");
    if (combo.length === 0) { container.innerHTML = '<span class="placeholder">技を選択...</span>'; return; }
    container.innerHTML = combo.map((m, i) => `<span class="combo-unit">${m.name}${i < combo.length - 1 ? '<span class="arrow">→</span>' : ''}</span>`).join("");
}

function undo() { combo.pop(); updateStats(); updateComboDisplay(); document.getElementById("followupList").innerHTML = "派生なし"; }
function clearCombo() { combo = []; totalDamage = 0; totalGauge = 0; updateStats(); updateComboDisplay(); document.getElementById("followupList").innerHTML = "派生なし"; }

function saveComboRoute() {
    const name = document.getElementById("comboName").value.trim();
    if (!name || combo.length === 0) return alert("名前と内容を入力してください");
    const memo = prompt("メモ（例：最速入力、微歩き）", "");
    const video = prompt("参考動画URL（YouTube/Xなど）", "");
    
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
