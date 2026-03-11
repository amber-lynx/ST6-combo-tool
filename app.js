let combo=[]
let damage=0
let frame=0
let spray=2

let useArrow=false

const iconMap={

LP:"icons/LP.png",
MP:"icons/MP.png",
HP:"icons/HP.png",

LK:"icons/LK.png",
MK:"icons/MK.png",
HK:"icons/HK.png"

}

function getIcon(name){

for(let key in iconMap){

if(name.includes(key))
return iconMap[key]

}

return null

}

function commandToArrow(cmd){

if(!useArrow) return cmd

return cmd
.replaceAll("236","↓↘→")
.replaceAll("214","↓↙←")
.replaceAll("623","→↓↘")
.replaceAll("421","←↓↙")
.replaceAll("22","↓↓")
.replaceAll("2","↓")
.replaceAll("6","→")
.replaceAll("4","←")
.replaceAll("8","↑")

}

const moves={

standing:[

{name:"立ち弱P",command:"5LP",damage:300,frame:4},
{name:"立ち中P",command:"5MP",damage:600,frame:6},
{name:"立ち強P",command:"5HP",damage:900,frame:8},

{name:"立ち弱K",command:"5LK",damage:300,frame:4},
{name:"立ち中K",command:"5MK",damage:700,frame:7},
{name:"立ち強K",command:"5HK",damage:900,frame:9}

],

crouching:[

{name:"しゃがみ弱P",command:"2LP",damage:300,frame:4},
{name:"しゃがみ中P",command:"2MP",damage:600,frame:6},
{name:"しゃがみ強P",command:"2HP",damage:900,frame:8},

{name:"しゃがみ弱K",command:"2LK",damage:300,frame:4},
{name:"しゃがみ中K",command:"2MK",damage:700,frame:7},
{name:"しゃがみ強K",command:"2HK",damage:900,frame:9}

],

movement:[

{name:"前ステップ",command:"66",frame:16},
{name:"DR",command:"DR",frame:8}

],

special:[

{
name:"疾駆け",
command:"214K",
followups:[

{name:"急停止",command:"P"},
{name:"胴刎ね",command:"LK"},
{name:"影すくい",command:"MK"},
{name:"首狩り",command:"HK"},
{name:"弧空",branch:true}

]
},

{
name:"弧空",
followups:[

{name:"武神イズナ落とし",command:"P"},
{name:"武神鉾刃脚",command:"K"}

]
},

{
name:"召雷細工",
command:"↓↓P",
followups:[

{name:"細工手裏剣",command:"↓↓P"},
{name:"乱れ細工手裏剣",command:"↓↓PP"}

]
},

{
name:"飛箭蹴",
command:"236K",
followups:[

{name:"↖"},
{name:"↑"},
{name:"↗"}

]
}

]

}

function drawMoves(){

let html=""

html+="<div class='category'><h2>Standing</h2><div class='standingGrid'>"

moves.standing.forEach(m=>{
html+=button(m,true)
})

html+="</div></div>"

html+="<div class='category'><h2>Crouching</h2>"

moves.crouching.forEach(m=>{
html+=button(m,false)
})

html+="</div>"

html+="<div class='category'><h2>Movement</h2>"

moves.movement.forEach(m=>{
html+=button(m,false)
})

html+="</div>"

html+="<div class='category'><h2>Special</h2>"

moves.special.forEach(m=>{
html+=button(m,false)
})

html+="</div>"

document.getElementById("moves").innerHTML=html

}

function button(m,showIcon){

let icon=getIcon(m.command||"")

let img=""

if(showIcon && icon)
img=`<img class="icon" src="${icon}">`

let cmd=m.command?`【${commandToArrow(m.command)}】`:""

return `
<button onclick='addMove(${JSON.stringify(m)})'>
${img}
${m.name}${cmd}
</button>
`

}

function addMove(m){

combo.push(m)

damage+=m.damage||0
frame+=m.frame||0

update()

if(m.followups)
showFollow(m.followups)

}

function showFollow(list){

let html="<h3>Followups</h3>"

list.forEach(f=>{

if(f.branch){

html+=`<button onclick="branch('弧空')">弧空</button>`

}else{

let cmd=f.command?`【${commandToArrow(f.command)}】`:""

html+=`<button onclick='addMove(${JSON.stringify(f)})'>${f.name}${cmd}</button>`

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

let cmd=m.command?`【${commandToArrow(m.command)}】`:""

html+=`<span class="comboMove">${m.name}${cmd}</span>`

if(i<combo.length-1)
html+=`<span class="arrow">→</span>`

})

document.getElementById("combo").innerHTML=html

document.getElementById("damage").innerText=damage
document.getElementById("frame").innerText=frame
document.getElementById("spray").innerText=spray

}

function clearCombo(){

combo=[]
damage=0
frame=0
spray=2

update()

}

function saveCombo(){

let saved=JSON.parse(localStorage.getItem("combos")||"[]")

saved.push(combo.map(c=>c.name))

localStorage.setItem("combos",JSON.stringify(saved))

drawSaved()

}

function drawSaved(){

let saved=JSON.parse(localStorage.getItem("combos")||"[]")

let html=""

saved.forEach(c=>{
html+=`<div>${c.join(" → ")}</div>`
})

document.getElementById("saved").innerHTML=html

}

drawMoves()
drawSaved()
