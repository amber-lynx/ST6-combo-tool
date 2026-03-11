let combo = [];

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

const moves = {
    standing:[
        {name:"弱P", num:7},{name:"中P", num:8},{name:"強P", num:9},
        {name:"弱K", num:4},{name:"中K", num:5},{name:"強K", num:6},
        {name:"前J", num:1},{name:"前J中P", num:2},{name:"前J中K", num:3}
    ],
    special:[
        {name:"武神旋風脚", cmd:"214K"},
        {name:"武神旋風脚（OD）", cmd:"214KK"},
        {name:"空中武神旋風脚（前J）", cmd:"214K"},
        {name:"空中武神旋風脚（OD）（前J）", cmd:"214KK"},
        {name:"流転一文字", cmd:"236P"},
        {name:"流転一文字（OD）", cmd:"236PP"},
        {name:"彩隠形", cmd:"214P"},
        {name:"彩隠形（OD）", cmd:"214PP"},
        {name:"荒鵺捻り（前J）", cmd:"236P"},
        {name:"荒鵺捻り（OD）（前J）", cmd:"236PP"},
        {name:"疾駆け", cmd:"214K", followups:[
            {name:"急停止", cmd:"P"},
            {name:"胴刎ね", cmd:"弱K"},
            {name:"影すくい", cmd:"中K"},
            {name:"首狩り", cmd:"強K"},
            {name:"弧空", followups:[
                {name:"武神イズナ落とし", cmd:"P"},
                {name:"武神鉾刃脚", cmd:"K"}
            ]}
        ]},
        {name:"疾駆け（OD）", cmd:"214KK", followups:[
            {name:"急停止", cmd:"P"},
            {name:"胴刎ね", cmd:"弱K"},
            {name:"影すくい", cmd:"中K"},
            {name:"首狩り", cmd:"強K"},
            {name:"弧空", followups:[
                {name:"武神イズナ落とし", cmd:"P"},
                {name:"武神鉾刃脚", cmd:"K"}
            ]}
        ]},
        {name:"召雷細工", followups:[
            {name:"細工手裏剣", cmd:"↓↓P"},
            {name:"乱れ細工手裏剣", cmd:"↓↓PP"}
        ]}
    ],
    unique:[
        {name:"水切り蹴り", cmd:"3中K"},
        {name:"風車", cmd:"4強K"},
        {name:"飛箭蹴", cmd:"6強K", followups:[{name:"↖"},{name:"↑"},{name:"↗"}]},
        {name:"肘落とし（前J）", cmd:"2中P"},
        {name:"武神虎連牙", cmd:"中P＞強P"},
        {name:"武神天架拳", cmd:"弱P＞中P＞強P＞強K"},
        {name:"武神獄鎖拳", cmd:"弱P＞中P＞2強P＞強K"},
        {name:"武神獄鎖投げ", cmd:"弱P＞中P＞2強P＞2強K"}
    ],
    throw:[
        {name:"縄掛背負い", cmd:"6弱P弱K"},
        {name:"鍾打巴", cmd:"4弱P弱K"}
    ],
    system:[
        {name:"ドライブインパクト", cmd:"強P強K"},
        {name:"ドライブリバーサル", cmd:"強P強K"},
        {name:"パリィ", cmd:"中P中K"},
        {name:"ドライブラッシュ", cmd:"66"}
    ],
    sa:[
        {name:"武神乱拍手 SA1", cmd:"236236K"},
        {name:"武神天翔亢竜 SA2", cmd:"214214P"},
        {name:"武神顕現神楽 SA3", cmd:"236236P"}
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
        <button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
            <img src="${icon}">
            <span>${m.name}${m.num?`【${m.num}】`:""}</span>
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
}

function clearCombo(){
    combo=[];
    update();
    document.getElementById("followupsText").innerText="派生技なし";
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
