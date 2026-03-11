let combo = [];

const iconMap = {
    "弱P": "icons/LP.png", "中P": "icons/MP.png", "強P": "icons/HP.png",
    "弱K": "icons/LK.png", "中K": "icons/MK.png", "強K": "icons/HK.png"
};

const moves = {
    standing: [
        { name: "弱P", num: 7 }, { name: "中P", num: 8 }, { name: "強P", num: 9 },
        { name: "弱K", num: 4 }, { name: "中K", num: 5 }, { name: "強K", num: 6 },
    ],
    special: [
        { name: "武神旋風脚", cmd: "214K" },
        { name: "武神旋風脚（OD）", cmd: "214KK" },
        { name: "流転一文字", cmd: "236P" },
        { name: "流転一文字（OD）", cmd: "236PP" },
        { name: "彩隠形", cmd: "214P" },
        { name: "彩隠形（OD）", cmd: "214PP" },
        { name: "荒鵺捻り（J）", cmd: "236P" },
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
        { 
            name: "細工手裏剣", cmd: "22P",
            followups: [
                { name: "爆発", cmd: "自動" }
            ]
        }
    ],
    unique: [
        { name: "水切り蹴り", cmd: "3中K" },
        { name: "風車", cmd: "4強K" },
        { name: "飛箭蹴", cmd: "6強K" },
        { name: "武神虎連牙", cmd: "MP>HP" },
        { name: "武神天架拳", cmd: "LP>MP>HP>HK" },
        { name: "武神獄鎖拳", cmd: "LP>MP>2HP>HK" }
    ],
    system: [
        { name: "インパクト", cmd: "HP+HK" },
        { name: "パリィ", cmd: "MP+MK" },
        { name: "ラッシュ", cmd: "66" }
    ],
    sa: [
        { name: "SA1 武神乱拍手", cmd: "236236K" },
        { name: "SA2 武神天翔亢竜", cmd: "214214P" },
        { name: "SA3 武神顕現神楽", cmd: "236236P" }
    ]
};

// 初期化
document.addEventListener("DOMContentLoaded", () => {
    drawMoves();
    displaySavedCombos();
});

function getIcon(name) {
    for (let key in iconMap) {
        if (name.includes(key)) return iconMap[key];
    }
    return "";
}

function drawMoves() {
    let html = "";
    html += drawStanding();
    html += drawCategory("必殺技", moves.special, 2);
    html += `<div class="category"><h3>派生技</h3><div id="followupsContainer" class="followup-grid">派生技なし</div></div>`;
    html += drawCategory("特殊技", moves.unique);
    html += drawCategory("共通", moves.system);
    html += drawCategory("SA", moves.sa);
    document.getElementById("moves").innerHTML = html;
}

function drawStanding() {
    let html = `<div class="category"><h3>通常技</h3><div class="standingGrid">`;
    moves.standing.forEach(m => {
        let icon = getIcon(m.name);
        html += `
        <button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
            <img src="${icon}" onerror="this.style.display='none'">
            <span>${m.name}</span>
        </button>`;
    });
    html += `</div></div>`;
    return html;
}

function drawCategory(title, list, cols = 1) {
    let html = `<div class="category"><h3>${title}</h3><div class="gridCols${cols}">`;
    list.forEach(m => {
        let cmd = m.cmd ? `<small>【${m.cmd}】</small>` : "";
        html += `<button onclick='addMove(${JSON.stringify(m)})'>${m.name}${cmd}</button>`;
    });
    html += "</div></div>";
    return html;
}

function addMove(m) {
    combo.push(m);
    updateComboDisplay();
    
    const container = document.getElementById("followupsContainer");
    if (m.followups) {
        showFollowups(m.followups);
    } else {
        container.innerHTML = "派生なし";
    }
}

function showFollowups(list) {
    const container = document.getElementById("followupsContainer");
    container.innerHTML = "";
    list.forEach(f => {
        const btn = document.createElement("button");
        let cmd = f.cmd ? `【${f.cmd}】` : "";
        btn.innerHTML = `${f.name}<br>${cmd}`;
        btn.className = "followup-btn";
        btn.onclick = () => addMove(f);
        container.appendChild(btn);
    });
}

function updateComboDisplay() {
    const container = document.getElementById("combo");
    container.innerHTML = combo.map((m, i) => `
        <span class="comboMove" onclick="removeStep(${i})">
            ${m.name}
            ${i < combo.length - 1 ? '<span class="arrow">→</span>' : ''}
        </span>
    `).join("");
}

// 1手戻る
function undo() {
    combo.pop();
    updateComboDisplay();
    document.getElementById("followupsContainer").innerHTML = "派生なし";
}

// 指定したステップを削除
function removeStep(index) {
    combo.splice(index, 1);
    updateComboDisplay();
}

function clearCombo() {
    combo = [];
    updateComboDisplay();
    document.getElementById("followupsContainer").innerHTML = "派生なし";
}

// 保存
function saveComboRoute() {
    const name = document.getElementById("comboName").value.trim();
    const category = document.getElementById("comboCategory") ? document.getElementById("comboCategory").value.trim() : "通常";
    
    if (!name || combo.length === 0) {
        alert("名前とコンボを入力してください");
        return;
    }
    
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved.push({
        id: Date.now(),
        name: name,
        category: category,
        route: combo.map(c => c.name)
    });
    
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    document.getElementById("comboName").value = "";
    alert("保存しました！");
    displaySavedCombos();
}

// 保存済みリスト表示
function displaySavedCombos() {
    const container = document.getElementById("savedList");
    if (!container) return;
    
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    container.innerHTML = saved.reverse().map(item => `
        <div class="saved-item">
            <strong>${item.name} (${item.category})</strong>
            <p>${item.route.join(" > ")}</p>
            <button onclick="deleteCombo(${item.id})">削除</button>
        </div>
    `).join("");
}

function deleteCombo(id) {
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved = saved.filter(item => item.id !== id);
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    displaySavedCombos();
}
