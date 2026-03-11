let combo=[]

const iconMap={

"弱P":"icons/LP.png",
"中P":"icons/MP.png",
"強P":"icons/HP.png",

"弱K":"icons/LK.png",
"中K":"icons/MK.png",
"強K":"icons/HK.png"

}

function getIcon(name){

for(let key in iconMap){

if(name.includes(key))
return iconMap[key]

}

return null

}

function convertCommand(cmd){

return cmd
.replaceAll("236","↓↘→")
.replaceAll("214","↓↙←")
.replaceAll("66","→→")
.replaceAll("22","↓↓")

}

const moves={

standing:[

{name:"立弱P"},
{name:"立中P"},
{name:"立強P"},

{name:"立弱K"},
{name:"立中K"},
{name:"立強K"}

],

special:[

{name:"武神旋風脚【214K】"},
{name:"武神旋風脚（OD）【214KK】"},

{name:"空中武神旋風脚（前J）【214K】"},
{name:"空中武神旋風脚（前JOD）【214KK】"},

{name:"流転一文字【236P】"},
{name:"流転一文字（OD）【236PP】"},

{name:"彩隠形【214P】"},
{name:"彩隠形（OD）【214PP】"},

{name:"荒鵺捻り（前J）【236P】"},
{name:"荒鵺捻り（前JOD）【236PP】"},

{name:"疾駆け【214K】",
followups:[

{name:"急停止 P"},
{name:"胴刎ね 弱K"},
{name:"影すくい 中K"},
{name:"首狩り 強K"},
{name:"弧空"}

]},

{name:"召雷細工",
followups:[

{name:"細工手裏剣 ↓↓P"},
{name:"乱れ細工手裏剣 ↓↓PP"}

]}

],

unique:[

{name:"水切り蹴り【3中K】"},
{name:"風車【4強K】"},

{name:"飛箭蹴【6強K】",
followups:[

{name:"↖"},
{name:"↑"},
{name:"↗"}

]},

{name:"肘落とし（前J）【2中P】"},

{name:"武神虎連牙 中P＞強P"},
{name:"武神天架拳 弱P＞中P＞強P＞強K"},
{name:"武神獄鎖拳 弱P＞中P＞2強P＞強K"},
{name:"武神獄鎖投げ 弱P＞中P＞2強P＞2強K"}

],

throw:[

{name:"縄掛背負い【5or6＋弱P弱K】"},
{name:"鍾打巴【4＋弱P弱K】"}

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

}

function drawMoves(){

let html=""

html+=drawCategory("Standing",moves.standing,true)
html+=drawCategory("Special",moves.special)
html+=drawCategory("特殊技",moves.unique)
html+=drawCategory("通常投げ",moves.throw)
html+=drawCategory("共通システム",moves.system)
html+=drawCategory("SA",moves.sa)

document.getElementById("moves").innerHTML=html

}

function drawCategory(title,list,grid=false){

let html=`<div class="category"><h3>${title}</h3>`

if(grid){

html+=`<div class="standingGrid">`

list.forEach(m=>{

let icon=getIcon(m.name)

html+=`
<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
<img src="${icon}">
</button>
`

})

html+=`</div>`

}else{

list.forEach(m=>{

let icon=getIcon(m.name)
let img=""

if(icon)
img=`<img class="icon" src="${icon}">`

html+=`
<button onclick='addMove(${JSON.stringify(m)})'>
${img}${m.name}
</button>
`

})

}

html+="</div>"

return html

}

function addMove(m){

combo.push(m)

update()

if(m.followups)
showFollow(m.followups)

}

function showFollow(list){

let html=""

list.forEach(f=>{

html+=`<button onclick='addMove(${JSON.stringify(f)})'>${f.name}</button>`

})

document.getElementById("followups").innerHTML=html

}

function update(){

let html=""

combo.forEach((m,i)=>{

let icon=getIcon(m.name)
let img=""

if(icon)
img=`<img class="icon" src="${icon}">`

html+=`<span class="comboMove">${img}${m.name}</span>`

if(i<combo.length-1)
html+=`<span class="arrow">→</span>`

})

document.getElementById("combo").innerHTML=html

}

function clearCombo(){

combo=[]
update()

}

drawMoves()
