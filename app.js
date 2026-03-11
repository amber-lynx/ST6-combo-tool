let combo = [];

const iconMap = {
    "弱P": "icons/LP.png", "中P": "icons/MP.png", "強P": "icons/HP.png",
    "弱K": "icons/LK.png", "中K": "icons/MK.png", "強K": "icons/HK.png"
};

const moves = {
    // 立ち攻撃
    standing: [
        { name: "弱P", num: 7, cmd: "LP" }, { name: "中P", num: 8, cmd: "MP" }, { name: "強P", num: 9, cmd: "HP" },
        { name: "弱K", num: 4, cmd: "LK" }, { name: "中K", num: 5, cmd: "MK" }, { name: "強K", num: 6, cmd: "HK" },
    ],
    // しゃがみ攻撃（キンバリーには必須！）
    crouching: [
        { name: "屈弱P", cmd: "2LP" }, { name: "屈中P", cmd: "2MP" }, { name: "屈強P", cmd: "2HP" },
        { name: "屈弱K", cmd: "2LK" }, { name: "屈中K", cmd: "2MK" }, { name: "屈強K", cmd: "2HK" },
    ],
    special: [
        { name: "武神旋風脚", cmd: "214K" },
        { name: "流転一文字", cmd: "236P" },
        { name: "彩隠形", cmd: "214P" },
        { 
            name: "疾駆け", cmd: "214K", 
            followups: [
                { name: "急停止", cmd: "P" },
                { name: "胴刎ね", cmd: "K" },
                { name: "影すくい", cmd: "2K" },
                { name: "首狩り", cmd: "6K" },
                { 
                    name: "弧空", cmd: "8",
                    followups: [
                        { name: "武神イズナ落とし", cmd: "P" },
                        { name: "武神鉾刃脚", cmd: "K" }
                    ]
                }
            ]
        },
        { name: "細工手裏剣", cmd: "22P" }
    ],
    unique: [
        { name: "水切り蹴り", cmd: "3中K" },
        { name: "風車", cmd: "4強K" },
        { name: "飛箭蹴", cmd: "6強K" },
        { name: "武神虎連牙", cmd: "MP>HP" },
        { name: "武神天架拳", cmd: "LP>MP>HP>HK" }
    ],
    sa: [
        { name: "SA1 武神乱拍手", cmd: "236236K" },
        { name: "SA2 武神天翔亢竜", cmd: "214214P" },
        { name: "SA3 武神顕現神楽", cmd: "236236P" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    drawMoves();
});

function getIcon(name) {
    for (let key in iconMap) {
        if (name.includes(key)) return iconMap[key];
    }
    return "";
}

function drawMoves() {
    const container = document.getElementById("moves");
    if (!container) return;

    let html = "";
    
    // 通常技（立ち・しゃがみ）
    html += `<div class="category"><h3>Normals (Stand/Crouch)</h3>`;
    html += `<div class="standingGrid">`;
    moves.standing.forEach(m => {
        html += `<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
            <img src="${getIcon(m.name)}" onerror="this.style.display='none'">
            <span>${m.name}</span>
        </button>`;
    });
    moves.crouching.forEach(m => {
        html += `<button class="standingBtn crouch" onclick='addMove(${JSON.stringify(m)})'>
            <span>${m.name}</span>
        </button>`;
    });
    html += `</div></div>`;

    // 必殺技・派生・特殊技・SA
    html += drawSection("Special Moves", moves.special);
    html += `<div class="category highlight"><h3>Followup (派生)</h3><div id="followupList" class="followup-grid">選択可能な派生なし</div></div>`;
    html += drawSection("Unique Attacks", moves.unique);
    html += drawSection("Super Arts", moves.sa);
    
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

// 技追加：再帰的に派生を表示できるように改善
function addMove(m) {
    combo.push(m);
    updateComboDisplay();
    
    const followupContainer = document.getElementById("followupList");
    // もし選んだ技に派生があるなら、ボタンを表示
    if (m.followups && m.followups.length > 0) {
        followupContainer.innerHTML = m.followups.map(f => 
            `<button class="followup-btn active" onclick='addMove(${JSON.stringify(f)})'>
                ${f.name} <br><small>${f.cmd || ''}</small>
            </button>`
        ).join("");
    } else {
        // 派生がない技ならリセット
        followupContainer.innerHTML = '<span class="none">選択可能な派生なし</span>';
    }
}

// コンボ表示：コマンドも一緒に表示して見やすく改善
function updateComboDisplay() {
    const container = document.getElementById("combo");
    if (!container) return;
    
    container.innerHTML = combo.map((m, i) => `
        <span class="combo-unit">
            <span class="combo-name">${m.name}</span>
            <small class="combo-cmd">${m.cmd || ''}</small>
            ${i < combo.length - 1 ? '<span class="arrow">→</span>' : ''}
        </span>
    `).join("");
}

function undo() {
    combo.pop();
    updateComboDisplay();
    // 直前の技に合わせて派生表示を戻すのは複雑なので、Undo時は一度リセット
    document.getElementById("followupList").innerHTML = '<span class="none">選択可能な派生なし</span>';
}

function clearCombo() {
    combo = [];
    updateComboDisplay();
    document.getElementById("followupList").innerHTML = '<span class="none">選択可能な派生なし</span>';
}

function saveComboRoute() {
    const name = document.getElementById("comboName").value.trim();
    if (!name || combo.length === 0) return alert("名前と内容を入力してください");

    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved.push({
        id: Date.now(),
        name: name,
        route: combo.map(c => c.name),
        display: combo.map(c => c.name).join(" > ")
    });
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    alert("保存完了！");
    clearCombo();
    document.getElementById("comboName").value = "";
}
