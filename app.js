let combo=[]
let damage=0
let frame=0

function convertCommand(cmd){

return cmd
.replaceAll("236","↓↘→")
.replaceAll("214","↓↙←")
.replaceAll("66","→→")
.replaceAll("22","↓↓")

}

function formatMove(name,cmd,od){

let text=name

if(cmd)
text+="【"+convertCommand(cmd)+"】"

if(od)
text+=" (OD"+od+")"

return text

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

{name:formatMove("武神旋風脚","214K",2)},

{name:formatMove("空中武神旋風脚（前J）","214K",2)},

{name:"疾駆け",followups:[

{name:"急停止 P"},
{name:"胴刎ね 弱K"},
{name:"影すくい 中K"},
{name:"首狩り 強K"},
{name:"弧空",branch:true}

]},

{name:"弧空",followups:[

{name:"武神イズナ落とし P"},
{name:"武神鉾刃脚 K"}

]},

{name:formatMove("流転一文字","236P",2)},

{name:formatMove("彩隠形","214P",2)},

{name:"召雷細工",followups:[

{name:"細工手裏剣 ↓↓P"},
{name:"乱れ細工手裏剣 ↓↓PP"}

]}

],

sa:[

{name:formatMove("武神乱拍手 SA1","236236K")},
{name:formatMove("武神天翔亢竜 SA2","214214P")},
{name:formatMove("武神顕現神楽 SA3","236236P")}

]

}

function drawMoves(){

let html=""

html+="<div class='category'><h2>Standing</h2><div class='standingGrid'>"

moves.standing.forEach(m=>{

html+=`

<button class="standingBtn" onclick='addMove(${JSON.stringify(m)})'>
<img src="icons/LP.png">
</button>

`

})

html+="</div></div>"

html+="<div class='category'><h2>Special</h2>"

moves.special.forEach(m=>{

html+=button(m)

})

html+="</div>"

html+="<div class='category'><h2>SA</h2>"

moves.sa.forEach(m=>{

html+=button(m)

})

html+="</div>"

document.getElementById("moves").innerHTML=html

}

function button(m){

return `
<button onclick='addMove(${JSON.stringify(m)})'>
${m.name}
</button>
`

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

if(f.branch){

html+=`<button onclick="branch('弧空')">弧空</button>`

}else{

html+=`<button onclick='addMove(${JSON.stringify(f)})'>${f.name}</button>`

}

})

document.getElementById("followups").innerHTML=html

}

function branch(name){

let m=moves.special.find(v=>v.name==name)

showFollow(m.followups)

}

function update(){

let html=""

combo.forEach((m,i)=>{

html+=`<span class="comboMove">${m.name}</span>`

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
