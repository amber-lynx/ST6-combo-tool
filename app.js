let combo = [];

const iconMap = {
    "弱P":"icons/LP.png",
    "中P":"icons/MP.png",
    "強P":"icons/HP.png",
    "弱K":"icons/LK.png",
    "中K":"icons/MK.png",
    "強K":"icons/HK.png"
};

// --- 技データ省略（先ほどのStanding, Special, Unique, Throw, System, SAをここに入れる） --- 

// --- コンボ操作 ---
function addMove(m){
    combo.push(m);
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
        html+=`<button onclick='addMove(${JSON.stringify(f)})'>${f.name}</button>`;
    });
    document.getElementById("followupsText").innerHTML=html;
}

function update(){
    let html="";
    combo.forEach((m,i)=>{
        html+=`<span class="comboMove">【${m.name}】</span>`;
        if(i<combo.length-1) html+=`<span class="arrow">→</span>`;
    });
    document.getElementById("combo").innerHTML=html;
}

function clearCombo(){
    combo=[];
    update();
    document.getElementById("followupsText").innerText="派生技なし";
}

// --- コンボルート保存 ---
function saveComboRoute(){
    const name = document.getElementById("comboName").value.trim();
    if(!name || combo.length === 0){
        alert("名前とコンボを入力してください");
        return;
    }
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved.push({name:name, route: combo.map(c=>c.name)});
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    drawSavedRoutes();
    document.getElementById("comboName").value="";
}

function cancelComboRoute(){
    document.getElementById("comboName").value="";
}

// --- 登録済みコンボ表示 ---
function drawSavedRoutes(){
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    let html="";
    saved.forEach(s=>{
        html+=`<div><b>${s.name}</b> : ${s.route.join(" → ")}</div>`;
    });
    document.getElementById("savedRoutes").innerHTML=html;
}

// --- 初期描画 ---
drawMoves();
drawSavedRoutes();
