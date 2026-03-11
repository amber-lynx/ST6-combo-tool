let combo=[]
let damage=0
let frame=0
let spray=2

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

const moves={

standing:[

{name:"立LP",command:"5LP",damage:300,frame:4},
{name:"立MP",command:"5MP",damage:600,frame:6},
{name:"立HP",command:"5HP",damage:900,frame:8},

{name:"立LK",command:"5LK",damage:300,frame:4},
{name:"立MK",command:"5MK",damage:700,frame:7},
{name:"立HK",command:"5HK",damage:900,frame:9}

],

crouching:[

{name:"↓LP",command:"2LP",damage:300,frame:4},
{name:"↓MP",command:"2MP",damage:600,frame:6},
{name:"↓HP",command:"2HP",damage:900,frame:8},

{name:"↓LK",command:"2LK",damage:300,frame:4},
{name:"↓MK",command:"2MK",damage:700,frame:7},
{name:"↓HK",command:"2HK",damage:900,frame:9}

],

movement:[

{name:"前ステップ",command:"66",damage:0,frame:16},
{name:"DR",command:"DR",damage:0,frame:8}

],

special:[

{name:"流転",command:"236P",damage:800,frame:10},

{
name:"疾駆け",
command:"214K",
frame:18,
followups:[

{name:"急停止",command:"P"},
{name:"胴刎ね",command:"LK",damage:900,frame:12},
{name:"影すくい",command:"MK",damage:1000,frame:14},
{name:"首狩り",command:"HK",damage:1100,frame:16},
{name:"弧空",branch:true}

]
},

{
name:"弧空",
followups:[

{name:"武神イズナ落とし",command:"P",damage:1600,frame:20},
{name:"武神鉾刃脚",command:"K",damage:1400,frame:18}

]
}

]

}

function drawMoves(){

let html=""

html+="<div class='category'><h2>Standing</h2>"

moves.standing.forEach(m=>{
html+=button(m)
})

html+="</div>"

html+="<div class='category'><h2>Crouching</h2>"

moves.crouching.forEach(m=>{
html+=button(m)
})

html+="</div>"

html+="<div class='category'><h2>Movement</h2>"

moves.movement.forEach(m=>{
html+=button(m)
})

html+="</div>"

html+="<div class='category'><h2>Special</h2>"

moves.special.forEach(m=>{
html+=button(m)
})

html+="</div>"

document.getElementById("moves").innerHTML=html

}

function button(m){

let icon=getIcon(m.name)

let img=""

if(icon)
img=`<img class="icon" src="${icon}">`

let cmd=m.command?`<span style="opacity:0.6">(${m.command})</span>`:""

return `
<button onclick='addMove(${JSON.stringify(m)})'>
${img}
${m.name} ${cmd}
</button>
`

}

drawMoves()

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

let cmd=f.command?`<span style="opacity:0.6">(${f.command})</span>`:""

html+=`<button onclick='addMove(${JSON.stringify(f)})'>${f.name} ${cmd}</button>`

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

let icon=getIcon(m.name)

let img=""

if(icon)
img=`<img src="${icon}">`

let cmd=m.command?`<span style="opacity:0.6">(${m.command})</span>`:""

html+=`<span class="comboMove">${img}${m.name} ${cmd}</span>`

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

saved.push(combo.map(c=>c.command || c.name))

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

drawSaved()
