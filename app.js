let combo = [];
let isODMode = false;
let totalDamage = 0;

const iconMap = {
    "弱P": "icons/LP.png", "中P": "icons/MP.png", "強P": "icons/HP.png",
    "弱K": "icons/LK.png", "中K": "icons/MK.png", "強K": "icons/HK.png"
};

const moves = {
    standing: [
        { name: "弱P", cmd: "LP", dmg: 300 }, { name: "中P", cmd: "MP", dmg: 600 }, { name: "強P", cmd: "HP", dmg: 800 },
        { name: "弱K", cmd: "LK", dmg: 300 }, { name: "中K", cmd: "MK", dmg: 700 }, { name: "強K", cmd: "HK", dmg: 900 },
    ],
    crouching: [
        { name: "屈弱P", cmd: "2LP", dmg: 300 }, { name: "屈中P", cmd: "2MP", dmg: 600 }, { name: "屈強P", cmd: "2HP", dmg: 800 },
        { name: "屈弱K", cmd: "2LK", dmg: 300 }, { name: "屈中K", cmd: "2MK", dmg: 700 }, { name: "屈強K", cmd: "2HK", dmg: 900 },
    ],
    // 指定の順番で配置
     special: [
        { name: "武神旋風脚", cmd: "214K", odCmd: "214KK", hasOD: true, dmg: 1000, odDmg: 1200 },
        { name: "空中武神旋風脚", cmd: "j214K", odCmd: "j214KK", hasOD: true, dmg: 800, odDmg: 1000 },
        { 
            name: "疾駆け", cmd: "214K", odCmd: "214KK", hasOD: true, dmg: 0, 
            followups: [
                { name: "急停止", cmd: "P", dmg: 0 },
                { name: "胴刎ね", cmd: "K", dmg: 800 },
                { name: "影すくい", cmd: "2K", dmg: 800 },
                { name: "首狩り", cmd: "6K", dmg: 900 },
                { name: "弧空", cmd: "8", dmg: 0, followups: [
                    { name: "武神イズナ落とし", cmd: "P", dmg: 1500 },
                    { name: "武神鉾刃脚", cmd: "K", dmg: 1200 }
                ]}
            ]
        },
        { name: "流転一文字", cmd: "236P", odCmd: "236PP", hasOD: true, dmg: 1000, odDmg: 1200 },
        { name: "彩隠形", cmd: "214P", odCmd: "214PP", hasOD: true, dmg: 0, odDmg: 0 },
        { 
            name: "召雷細工", cmd: "22P", dmg: 0,
            followups: [
                { name: "細工手裏剣", cmd: "↓↓P", dmg: 200 },
                { name: "乱れ細工手裏剣", cmd: "↓↓PP", dmg: 400 }
            ]
        },
        { name: "荒鵺捻り", cmd: "j236P", odCmd: "j236PP", hasOD: true, dmg: 1300, odDmg: 1500 }
    ],
    unique: [
        { name: "水切り蹴り", cmd: "3中K", dmg: 600 },
        { name: "風車", cmd: "4強K", dmg: 800 },
        { 
            name: "飛箭蹴", cmd: "6強K", dmg: 700,
            followups: [{ name: "↖(7)" }, { name: "↑(8)" }, { name: "↗(9)" }]
        },
        { name: "肘落とし(前J)", cmd: "j2中P", dmg: 600 },
        { name: "武神虎連牙", cmd: "MP>HP", dmg: 1200 },
        { name: "武神天架拳", cmd: "LP>MP>HP>HK", dmg: 1800 },
        { name: "武神獄鎖拳", cmd: "LP>MP>2HP>HK", dmg: 1700 },
        { name: "武神獄鎖投げ", cmd: "LP>MP>2HP>2HK", dmg: 1600 }
    ],
    sa: [
        { name: "SA1 武神乱拍手", cmd: "236236K", dmg: 2100 },
        { name: "SA2 武神天翔亢竜", cmd: "214214P", dmg: 3000 },
        { name: "SA3 武神顕現神楽", cmd: "236236P", dmg: 4000 }
    ],
    system: [
        { name: "インパクト", cmd: "HP+HK", dmg: 800 },
        { name: "ラッシュ", cmd: "66", dmg: 0 }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(); // テーマ適用を分離
    drawMoves();
    updateDamageDisplay();
});

function setTheme(theme) {
    localStorage.setItem("selectedTheme", theme);
    applyTheme();
}

function applyTheme() {
    const theme = localStorage.getItem("selectedTheme") || "dark";
    document.body.className = 'theme-' + theme;
}

function toggleOD() {
    isODMode = !isODMode;
    const btn = document.getElementById("odSwitcher");
    if(btn) {
        btn.classList.toggle("active", isODMode);
        btn.innerHTML = isODMode ? "ODモード: ON 🔥" : "ODモード: OFF";
    }
    drawMoves();
}

function drawMoves() {
    const container = document.getElementById("moves");
    if (!container) return;
    let html = "";
    
    html += `<div class="category"><h3>Normals</h3><div class="standingGrid">`;
    [...moves.standing, ...moves.crouching].forEach(m => {
        html += `<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
            <img src="${getIcon(m.name)}" onerror="this.style.display='none'">
            <span>${m.name}</span>
        </button>`;
    });
    html += `</div></div>`;

    html += `<div class="category"><h3>Special Moves</h3><div class="move-grid">`;
    moves.special.forEach(m => {
        let name = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
        let cmd = (isODMode && m.hasOD) ? m.odCmd : m.cmd;
        let cls = (isODMode && m.hasOD) ? "class='od-active'" : "";
        html += `<button ${cls} onclick='addMove(${JSON.stringify(m)})'>${name} <small>${cmd}</small></button>`;
    });
    html += `</div></div>`;

    html += `<div class="category highlight"><h3>Followups</h3><div id="followupList" class="followup-grid">派生なし</div></div>`;
    html += drawSection("Unique Attacks", moves.unique);
    html += drawSection("Super Arts / System", [...moves.sa, ...moves.system]);
    
    container.innerHTML = html;
}

function drawSection(title, list) {
    let html = `<div class="category"><h3>${title}</h3><div class="move-grid">`;
    list.forEach(m => {
        html += `<button onclick='addMove(${JSON.stringify(m)})'>${m.name} <small>${m.cmd || ''}</small></button>`;
    });
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
        finalMove.cmd = m.odCmd;
        finalMove.dmg = m.odDmg;
    }
    combo.push(finalMove);
    calculateDamage();
    updateComboDisplay();
    
    const fContainer = document.getElementById("followupList");
    if (m.followups) {
        fContainer.innerHTML = m.followups.map(f => 
            `<button class="followup-btn active" onclick='addMove(${JSON.stringify(f)})'>${f.name} <small>${f.cmd || ''}</small></button>`
        ).join("");
    } else {
        fContainer.innerHTML = "派生なし";
    }
}

function calculateDamage() {
    totalDamage = combo.reduce((sum, m) => sum + (m.dmg || 0), 0);
    updateDamageDisplay();
}

function updateDamageDisplay() {
    const el = document.getElementById("damageCount");
    if (el) el.innerText = `Total Damage: ${totalDamage}`;
}

function updateComboDisplay() {
    const container = document.getElementById("combo");
    if (combo.length === 0) { container.innerHTML = "技を選択してください"; return; }
    container.innerHTML = combo.map((m, i) => `
        <span class="combo-unit">
            ${m.name} ${i < combo.length - 1 ? '<span class="arrow">→</span>' : ''}
        </span>
    `).join("");
}

function undo() {
    combo.pop();
    calculateDamage();
    updateComboDisplay();
    document.getElementById("followupList").innerHTML = "派生なし";
}

function clearCombo() {
    combo = [];
    totalDamage = 0;
    updateDamageDisplay();
    updateComboDisplay();
    document.getElementById("followupList").innerHTML = "派生なし";
}

function saveComboRoute() {
    const name = document.getElementById("comboName").value.trim();
    if (!name || combo.length === 0) return alert("名前と内容を入力してください");
    const situation = prompt("状況（例：画面端）", "中央");
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved.push({ id: Date.now(), name, damage: totalDamage, situation, route: combo.map(c => c.name) });
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    alert("保存完了！");
    clearCombo();
    document.getElementById("comboName").value = "";
}
