let combo = [];
let isODMode = false; // ODモードの状態

const iconMap = {
    "弱P": "icons/LP.png", "中P": "icons/MP.png", "強P": "icons/HP.png",
    "弱K": "icons/LK.png", "中K": "icons/MK.png", "強K": "icons/HK.png"
};

const moves = {
    standing: [
        { name: "弱P", cmd: "LP" }, { name: "中P", cmd: "MP" }, { name: "強P", cmd: "HP" },
        { name: "弱K", cmd: "LK" }, { name: "中K", cmd: "MK" }, { name: "強K", cmd: "HK" },
    ],
    crouching: [
        { name: "屈弱P", cmd: "2LP" }, { name: "屈中P", cmd: "2MP" }, { name: "屈強P", cmd: "2HP" },
        { name: "屈弱K", cmd: "2LK" }, { name: "屈中K", cmd: "2MK" }, { name: "屈強K", cmd: "2HK" },
    ],
    // ゲージ専用アクション
    drive: [
        { name: "ドライブインパクト", cmd: "HP+HK" },
        { name: "ドライブリバーサル", cmd: "6+HP+HK" },
        { name: "キャンセルラッシュ", cmd: "66" },
    ],
    // 通常とODを統合（hasOD: true の技はスイッチで切り替わる）
    special: [
        { name: "武神旋風脚", cmd: "214K", odCmd: "214KK", hasOD: true },
        { name: "流転一文字", cmd: "236P", odCmd: "236PP", hasOD: true },
        { name: "彩隠形", cmd: "214P", odCmd: "214PP", hasOD: true },
        { name: "召雷細工", cmd: "22P" },
        { name: "荒鵺捻り", cmd: "j236P", odCmd: "j236PP", hasOD: true },
        { name: "空中武神旋風脚", cmd: "j214K", odCmd: "j214KK", hasOD: true },
        { 
            name: "疾駆け", cmd: "214K", odCmd: "214KK", hasOD: true,
            followups: [
                { name: "急停止", cmd: "P" }, { name: "胴刎ね", cmd: "K" },
                { name: "影すくい", cmd: "2K" }, { name: "首狩り", cmd: "6K" },
                { name: "弧空", cmd: "8", followups: [
                    { name: "武神イズナ落とし", cmd: "P" }, { name: "武神鉾刃脚", cmd: "K" }
                ]}
            ]
        }
    ],
    unique: [
        { name: "水切り蹴り", cmd: "3中K" }, { name: "風車", cmd: "4強K" },
        { name: "飛箭蹴", cmd: "6強K" }, { name: "肘落とし", cmd: "j2MP" },
        { name: "武神虎連牙", cmd: "MP>HP" },
        { name: "武神天架拳", cmd: "LP>MP>HP>HK" },
        { name: "武神獄鎖拳", cmd: "LP>MP>2HP>HK" },
        { name: "武神獄鎖投げ", cmd: "LP>MP>2HP>2HK" }
    ],
    sa: [
        { name: "SA1 武神乱拍手", cmd: "236236K" },
        { name: "SA2 武神天翔亢竜", cmd: "214214P" },
        { name: "SA3 武神顕現神楽", cmd: "236236P" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    drawMoves();
    setTheme(localStorage.getItem("selectedTheme") || "dark");
});

// ODモード切り替え
function toggleOD() {
    isODMode = !isODMode;
    const btn = document.getElementById("odSwitcher");
    btn.classList.toggle("active", isODMode);
    btn.innerHTML = isODMode ? "ODモード: ON 🔥" : "ODモード: OFF";
    // 技リストを再描画（ボタンのテキストをOD版に変えるため）
    drawMoves();
}

function setTheme(theme) {
    document.body.className = 'theme-' + theme;
    localStorage.setItem("selectedTheme", theme);
}

function drawMoves() {
    const container = document.getElementById("moves");
    if (!container) return;
    let html = "";
    
    // 通常技
    html += `<div class="category"><h3>Normals</h3><div class="standingGrid">`;
    moves.standing.forEach(m => { html += `<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'><img src="${getIcon(m.name)}" onerror="this.style.display='none'"><span>${m.name}</span></button>`; });
    moves.crouching.forEach(m => { html += `<button class="standingBtn crouch" onclick='addMove(${JSON.stringify(m)})'><span>${m.name}</span></button>`; });
    html += `</div></div>`;

    // 必殺技（ODモードなら名前を書き換えて表示）
    html += `<div class="category"><h3>Special Moves</h3><div class="move-grid">`;
    moves.special.forEach(m => {
        let displayName = (isODMode && m.hasOD) ? "OD" + m.name : m.name;
        let displayCmd = (isODMode && m.hasOD) ? m.odCmd : m.cmd;
        let activeClass = (isODMode && m.hasOD) ? "class='od-active'" : "";
        html += `<button ${activeClass} onclick='addMove(${JSON.stringify(m)})'>${displayName} <small>${displayCmd || ''}</small></button>`;
    });
    html += `</div></div>`;

    html += `<div class="category highlight"><h3>Followup (派生技)</h3><div id="followupList" class="followup-grid">選択可能な派生なし</div></div>`;
    html += drawSection("Drive System", moves.drive);
    html += drawSection("Unique Attacks", moves.unique);
    html += drawSection("Super Arts", moves.sa);
    container.innerHTML = html;
}

function drawSection(title, list) {
    let html = `<div class="category"><h3>${title}</h3><div class="move-grid">`;
    list.forEach(m => { html += `<button onclick='addMove(${JSON.stringify(m)})'>${m.name} <small>${m.cmd || ''}</small></button>`; });
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
    }
    combo.push(finalMove);
    updateComboDisplay();
    
    const followupContainer = document.getElementById("followupList");
    if (m.followups) {
        followupContainer.innerHTML = m.followups.map(f => `<button class="followup-btn active" onclick='addMove(${JSON.stringify(f)})'>${f.name} <br><small>${f.cmd || ''}</small></button>`).join("");
    } else {
        followupContainer.innerHTML = '<span class="none">選択可能な派生なし</span>';
    }
}

function updateComboDisplay() {
    const container = document.getElementById("combo");
    if (!container) return;
    if (combo.length === 0) { container.innerHTML = '<span class="placeholder">技を選択...</span>'; return; }
    container.innerHTML = combo.map((m, i) => `<span class="combo-unit"><span class="combo-name">${m.name}</span><small class="combo-cmd">${m.cmd || ''}</small>${i < combo.length - 1 ? '<span class="arrow">→</span>' : ''}</span>`).join("");
}

function undo() { combo.pop(); updateComboDisplay(); document.getElementById("followupList").innerHTML = '<span class="none">選択可能な派生なし</span>'; }
function clearCombo() { combo = []; updateComboDisplay(); document.getElementById("followupList").innerHTML = '<span class="none">選択可能な派生なし</span>'; }

function saveComboRoute() {
    const name = document.getElementById("comboName").value.trim();
    if (!name || combo.length === 0) return alert("名前と内容を入力してください");
    const dmg = prompt("ダメージを入力（任意）", "0");
    const situation = prompt("状況（例：画面端、カウンター）", "中央");
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved.push({ id: Date.now(), name, damage: dmg, situation, route: combo.map(c => c.name) });
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    alert("保存完了！");
    clearCombo();
    document.getElementById("comboName").value = "";
}
