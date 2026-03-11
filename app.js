let combo = [];
let totalDamage = 0;

const iconMap = {
    "弱P":"icons/LP.png",
    "中P":"icons/MP.png",
    "強P":"icons/HP.png",
    "弱K":"icons/LK.png",
    "中K":"icons/MK.png",
    "強K":"icons/HK.png"
};

function getIcon(name){
    for(let key in iconMap){
        if(name.includes(key)) return iconMap[key];
    }
    return "";
}

// 技データ
const moves = {
    standing:[
        {name:"弱P", damage:300},{name:"中P", damage:600},{name:"強P", damage:900},
        {name:"弱K", damage:300},{name:"中K", damage:700},{name:"強K", damage:900}
    ],
    special:[
        {name:"武神旋風脚", cmd:"214K", damage:1200},
        {name:"武神旋風脚（OD）", cmd:"214KK", damage:1500},
        {name:"疾駆け", cmd:"214K", damage:800, followups:[
            {name:"急停止", cmd:"P", damage:0},
            {name:"胴刎ね", cmd:"弱K", damage:900},
            {name:"影すくい", cmd:"中K", damage:1000},
            {name:"首狩り", cmd:"強K", damage:1100},
            {name:"弧空", followups:[
                {name:"武神イズナ落とし", cmd:"P", damage:1600},
                {name:"武神鉾刃脚", cmd:"K", damage:1400}
            ]}
        ]}
    ],
    unique:[
        {name:"水切り蹴り", cmd:"3中K", damage:500},
        {name:"風車", cmd:"4強K", damage:700}
    ],
    system:[
        {name:"ドライブインパクト", cmd:"強P強K", damage:600},
        {name:"ドライブリバーサル", cmd:"強P強K", damage:800}
    ],
    throw:[
        {name:"縄掛背負い", cmd:"6弱P弱K", damage:1000}
    ],
    sa:[
        {name:"武神乱拍手 SA1", cmd:"236236K", damage:2000}
    ]
};

// 描画
function drawMoves(){
    let html="";
    html+=drawStanding();
    html+=drawCategory("Special", moves.special, 2);
    html+=`<div class="category"><h3>派生</h3><div id="followupsText">派生技なし</div></div>`;
    html+=drawCategory("特殊技", moves.unique);
    html+=drawCategory("共通システム", moves.system);
    html+=drawCategory("通常投げ", moves.throw);
    html+=drawCategory("SA", moves.sa);
    document.getElementById("moves").innerHTML=html;
}

function drawStanding(){
    let html=`<div class="category"><h3>Standing</h3><div class="standingGrid">`;
    moves.standing.forEach(m=>{
        let icon = getIcon(m.name);
        html+=`
        <button class="standingBtn" draggable="true" ondragstart="drag(event)" onclick='addMove(${JSON.stringify(m)})'>
            <img src="${icon}">
            <span>${m.name}</span>
        </button>`;
    });
    html+=`</div></div>`;
    return html;
}

function drawCategory(title, list, cols=1){
    let html=`<div class="category"><h3>${title}</h3><div class="gridCols${cols}">`;
    list.forEach(m=>{
        let cmd = m.cmd?`【${m.cmd}】`:"";
        html+=`<button onclick='addMove(${JSON.stringify(m)})'>${m.name}${cmd}</button>`;
    });
    html+="</div></div>";
    return html;
}

function addMove(m){
    combo.push(m);
    totalDamage += m.damage||0;
    update();
    if(m.followups){
        showFollow(m.followups);
    } else {
        document.getElementById("followupsText").innerText="派生技なし";
    }
}

function showFollow(list){
    let html="";
    list.forEach(f=>{
        let cmd = f.cmd?`【${f.cmd}】`:"";
        html+=`<button onclick='addMove(${JSON.stringify(f)})'>${f.name}${cmd}</button>`;
    });
    document.getElementById("followupsText").innerHTML=html;
}

function update(){
    let html="";
    combo.forEach((m,i)=>{
        let cmd = m.cmd?`【${m.cmd}】`:"";
        html+=`<span class="comboMove">${m.name}${cmd}</span>`;
        if(i<combo.length-1) html+=`<span class="arrow">→</span>`;
    });
    document.getElementById("combo").innerHTML=html;
    document.getElementById("totalDamage").innerText = `ダメージ合計: ${totalDamage}`;
}

function clearCombo(){
    combo=[];
    totalDamage = 0;
    update();
    document.getElementById("followupsText").innerText="派生技なし";
}

// ドラッグ&ドロップ
let draggedIndex;
function drag(ev){ draggedIndex = Array.from(ev.target.parentNode.children).indexOf(ev.target); }
function allowDrop(ev){ ev.preventDefault(); }
function drop(ev){
    ev.preventDefault();
    const dropIndex = Array.from(ev.target.parentNode.children).indexOf(ev.target);
    if(draggedIndex === dropIndex) return;
    const temp = combo[draggedIndex];
    combo.splice(draggedIndex, 1);
    combo.splice(dropIndex, 0, temp);
    update();
}

function saveComboRoute(){
    const name = document.getElementById("comboName").value.trim();
    const category = document.getElementById("comboCategory").value.trim();
    if(!name || combo.length === 0){
        alert("名前とコンボを入力してください");
        return;
    }
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved.push({name:name, category:category, route: combo.map(c=>c.name)});
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    document.getElementById("comboName").value="";
    document.getElementById("comboCategory").value="";
    alert("登録完了！");
}

drawMoves();
