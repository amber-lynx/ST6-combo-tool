let combo = [];
let isODMode = false;
let totalDamage = 0;

const iconMap = {
    "弱P": "icons/LP.png", "中P": "icons/MP.png", "強P": "icons/HP.png",
    "弱K": "icons/LK.png", "中K": "icons/MK.png", "強K": "icons/HK.png"
};

// ダメージデータ（公式サイト参照）
const moves = {
    standing: [
        { name: "弱P", cmd: "LP", dmg: 300 }, { name: "中P", cmd: "MP", dmg: 600 }, { name: "強P", cmd: "HP", dmg: 800 },
        { name: "弱K", cmd: "LK", dmg: 300 }, { name: "中K", cmd: "MK", dmg: 700 }, { name: "強K", cmd: "HK", dmg: 900 },
    ],
    crouching: [
        { name: "屈弱P", cmd: "2LP", dmg: 300 }, { name: "屈中P", cmd: "2MP", dmg: 600 }, { name: "屈強P", cmd: "2HP", dmg: 800 },
        { name: "屈弱K", cmd: "2LK", dmg: 300 }, { name: "屈中K", cmd: "2MK", dmg: 700 }, { name: "屈強K", cmd: "2HK", dmg: 900 },
    ],
    special: [
        { name: "武神旋風脚", cmd: "214K", odCmd: "214KK", hasOD: true, dmg: 1000, odDmg: 1200 },
        { name: "流転一文字", cmd: "236P", odCmd: "236PP", hasOD: true, dmg: 1000, odDmg: 1200 },
        { name: "彩隠形", cmd: "214P", odCmd: "214PP", hasOD: true, dmg: 0, odDmg: 0 },
        { name: "荒鵺捻り", cmd: "j236P", odCmd: "j236PP", hasOD: true, dmg: 1300, odDmg: 1500 },
        { name: "空中武神旋風脚", cmd: "j214K", odCmd: "j214KK", hasOD: true, dmg: 800, odDmg: 1000 },
        { 
            name: "疾駆け", cmd: "214K", odCmd: "214KK", hasOD: true, dmg: 0, odDmg: 0,
            followups: [
                { name: "胴刎ね", cmd: "K", dmg: 800 },
                { name: "影すくい", cmd: "2K", dmg: 800 },
                { name: "首狩り", cmd: "6K", dmg: 900 },
                { name: "弧空", cmd: "8", dmg: 0, followups: [
                    { name: "武神イズナ落とし", cmd: "P", dmg: 1500 },
                    { name: "武神鉾刃脚", cmd: "K", dmg: 1200 }
                ]}
            ]
        }
    ],
    unique: [
        { name: "水切り蹴り", cmd: "3中K", dmg: 600 },
        { name: "風車", cmd: "4強K", dmg: 800 },
        { name: "飛箭蹴", cmd: "6強K", dmg: 700 },
        { name: "武神虎連牙", cmd: "MP>HP", dmg: 1200 },
        { name: "武神天架拳", cmd: "LP>MP>HP>HK", dmg: 1800 }
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
    drawMoves();
    updateDamageDisplay();
});

// ODスイッチ
function toggleOD() {
    isODMode = !isODMode;
    const btn = document.getElementById("odSwitcher");
    btn.classList.toggle("active", isODMode);
    btn.innerHTML = isODMode ? "ODモード: ON 🔥" : "ODモード: OFF";
    drawMoves();
}

function drawMoves() {
    const container = document.getElementById("moves");
    let html = "";
    
    // 配置最適化：通常技(Stand/Crouch)
    html += `<div class="category"><h3>Normals</h3><div class="standingGrid">`;
    const allNormals = [...moves.standing, ...moves.crouching];
    allNormals.forEach(m => {
        html += `<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
            <img src="${getIcon(m.name)}" onerror="this.style.display='none'">
            <span>${m.name}</span>
        </button>`;
    });
    html += `</div></div>`;

    // 必殺技（ODスイッチ連動）
    html += `<div class="category"><h3>Special Moves</h3><div class="move-grid">`;
    moves.special.forEach(m => {
        let name = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
        let cmd = (isODMode && m.hasOD) ? m.odCmd : m.cmd;
        let cls = (isODMode && m.hasOD) ? "class='od-active'" : "";
        html += `<button ${cls} onclick='addMove(${JSON.stringify(m)})'>${name} <small>${cmd}</small></button>`;
    });
    html += `</div></div>`;

    html += `<div class="category highlight"><h3>Followups</h3><div id="followupList" class="followup-grid">派生なし</div></div>`;
    html += drawSection("Unique / System", [...moves.unique, ...moves.system]);
    html += drawSection("Super Arts", moves.sa);
    
    container.innerHTML = html;
}

function drawSection(title, list) {
    let html = `<div class="category"><h3>${title}</h3><div class="move-grid">`;
    list.forEach(m => {
        html += `<button onclick='addMove(${JSON.stringify(m)})'>${m.name} <small>${m.cmd}</small></button>`;
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
            `<button class="followup-btn active" onclick='addMove(${JSON.stringify(f)})'>${f.name}</button>`
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

// UNDO機能
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
}
