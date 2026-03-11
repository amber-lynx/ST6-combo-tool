const moves = {
    standing: [
        { name: "弱P", num: 7, cmd: "LP" }, { name: "中P", num: 8, cmd: "MP" }, { name: "強P", num: 9, cmd: "HP" },
        { name: "弱K", num: 4, cmd: "LK" }, { name: "中K", num: 5, cmd: "MK" }, { name: "強K", num: 6, cmd: "HK" },
    ],
    crouching: [
        { name: "屈弱P", cmd: "2LP" }, { name: "屈中P", cmd: "2MP" }, { name: "屈強P", cmd: "2HP" },
        { name: "屈弱K", cmd: "2LK" }, { name: "屈中K", cmd: "2MK" }, { name: "屈強K", cmd: "2HK" },
    ],
    // 【新設】ドライブゲージ消費技
    drive: [
        { name: "ドライブインパクト（不動咎）", cmd: "HP+HK" },
        { name: "ドライブリバーサル（転）", cmd: "6+HP+HK" },
        { name: "ドライブパリィ", cmd: "MP+MK" },
        { name: "キャンセルラッシュ", cmd: "66" },
        { name: "OD版 必殺技", cmd: "ボタン2つ押し" }
    ],
    // 通常必殺技（ゲージ消費なし）
    special: [
        { name: "武神旋風脚", cmd: "214K" },
        { name: "空中武神旋風脚", cmd: "j214K" },
        { name: "流転一文字", cmd: "236P" },
        { name: "彩隠形", cmd: "214P" },
        { name: "召雷細工", cmd: "22P" },
        { name: "荒鵺捻り", cmd: "j236P" },
        { 
            name: "疾駆け", cmd: "214K", 
            followups: [
                { name: "急停止", cmd: "P" }, { name: "胴刎ね", cmd: "K" },
                { name: "影すくい", cmd: "2K" }, { name: "首狩り", cmd: "6K" },
                { 
                    name: "弧空", cmd: "8",
                    followups: [
                        { name: "武神イズナ落とし", cmd: "P" },
                        { name: "武神鉾刃脚", cmd: "K" }
                    ]
                }
            ]
        }
    ],
    unique: [
        { name: "水切り蹴り", cmd: "3中K" }, { name: "風車", cmd: "4強K" },
        { name: "飛箭蹴", cmd: "6強K" }, { name: "武神虎連牙", cmd: "MP>HP" }
    ],
    sa: [
        { name: "SA1 武神乱拍手", cmd: "236236K" },
        { name: "SA2 武神天翔亢竜", cmd: "214214P" },
        { name: "SA3 武神顕現神楽", cmd: "236236P" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    drawMoves();
    const savedTheme = localStorage.getItem("selectedTheme") || "dark";
    setTheme(savedTheme);
});

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
    moves.standing.forEach(m => {
        html += `<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'><img src="${getIcon(m.name)}" onerror="this.style.display='none'"><span>${m.name}</span></button>`;
    });
    moves.crouching.forEach(m => {
        html += `<button class="standingBtn crouch" onclick='addMove(${JSON.stringify(m)})'><span>${m.name}</span></button>`;
    });
    html += `</div></div>`;

    // 【ここを追加！】ドライブシステムを表示
    html += drawSection("Drive System (ゲージ消費)", moves.drive);

    // 必殺技・派生・特殊技・SA
    html += drawSection("Special Moves", moves.special);
    html += `<div class="category highlight"><h3>Followup</h3><div id="followupList" class="followup-grid">選択可能な派生なし</div></div>`;
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
    combo.push(m);
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
    saved.push({ id: Date.now(), name: name, damage: dmg, situation: situation, route: combo.map(c => c.name) });
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    alert("保存完了！");
    clearCombo();
    document.getElementById("comboName").value = "";
}
