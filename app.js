let combo = [];

const iconMap = {
    "弱P":"icons/LP.png",
    "中P":"icons/MP.png",
    "強P":"icons/HP.png",
    "弱K":"icons/LK.png",
    "中K":"icons/MK.png",
    "強K":"icons/HK.png"
};

function getIcon(name) {
    for(let key in iconMap){
        if(name.includes(key)) return iconMap[key];
    }
    return "";
}

// 全技データ
const moves = {

    standing:[
        {name:"弱P"},
        {name:"中P"},
        {name:"強P"},
        {name:"弱K"},
        {name:"中K"},
        {name:"強K"}
    ],

    special:[
        {name:"武神旋風脚【214K】"},
        {name:"武神旋風脚（OD）【214KK】"},
        {name:"空中武神旋風脚（前J）【214K】"},
        {name:"空中武神旋風脚（OD）（前J）【214KK】"},
        {name:"流転一文字【236P】"},
        {name:"流転一文字（OD）【236PP】"},
        {name:"彩隠形【214P】"},
        {name:"彩隠形（OD）【214PP】"},
        {name:"荒鵺捻り（前J）【236P】"},
        {name:"荒鵺捻り（OD）（前J）【236PP】"},
        {name:"疾駆け【214K】", followups:[
            {name:"急停止 P"},
            {name:"胴刎ね 弱K"},
            {name:"影すくい 中K"},
            {name:"首狩り 強K"},
            {name:"弧空"}
        ]},
        {name:"召雷細工", followups:[
            {name:"細工手裏剣 ↓↓P"},
            {name:"乱れ細工手裏剣 ↓↓PP"}
        ]}
    ],

    unique:[
        {name:"水切り蹴り【3中K】"},
        {name:"風車【4強K】"},
        {name:"飛箭蹴【6強K】", followups:[
            {name:"↖"}, {name:"↑"}, {name:"↗"}
        ]},
        {name:"肘落とし（前J）【2中P】"},
        {name:"武神虎連牙 中P＞強P"},
        {name:"武神天架拳 弱P＞中P＞強P＞強K"},
        {name:"武神獄鎖拳 弱P＞中P＞2強P＞強K"},
        {name:"武神獄鎖投げ 弱P＞中P＞2強P＞2強K"}
    ],

    throw:[
        {name:"縄掛背負い【6弱P弱K】"},
        {name:"鍾打巴【4弱P弱K】"}
    ],

    system:[
        {name:"ドライブインパクト【強P強K】"},
        {name:"ドライブリバーサル【強P強K】"},
        {name:"パリィ【中P中K】"},
        {name:"ドライブラッシュ【66】"}
    ],

    sa:[
        {name:"武神乱拍手 SA1【236236K】"},
        {name:"武神天翔亢竜 SA2【214214P】"},
        {name:"武神顕現神楽 SA3【236236P】"}
    ]

};

// 描画
function drawMoves(){
    let html="";
    html+=drawStanding();
    html+=drawCategory("Special", moves.special);
    html+=`<div class="category"><h3>派生</h3><div id="followupsText">派生技なし</div></div>`;
    html+=drawCategory("特殊技", moves.unique);
    html+=drawCategory("通常投げ", moves.throw);
    html+=drawCategory("共通システム", moves.system);
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
            <span>${m.name}</span>
        </button>`;
    });
    html+=`</div></div>`;
    return html;
}

function drawCategory(title, list){
    let html=`<div class="category"><h3>${title}</h3>`;
    list.forEach(m=>{
        html+=`<button onclick='addMove(${JSON.stringify(m)})'>${m.name}</button>`;
    });
    html+="</div>";
    return html;
}

// 技追加
function addMove(m){
    combo.push(m);
    update();
    if(m.followups){
        showFollow(m.followups);
    } else {
        document.getElementById("followupsText").innerText="派生技なし";
    }
}

// 派生技
function showFollow(list){
    let html="";
    list.forEach(f=>{
        html+=`<button onclick='addMove(${JSON.stringify(f)})'>${f.name}</button>`;
    });
    document.getElementById("followupsText").innerHTML=html;
}

// コンボ更新
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

drawMoves();
