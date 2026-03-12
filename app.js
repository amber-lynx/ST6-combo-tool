let combo=[]
let totalDamage=0

const iconMap={

"弱P":"icons/LP.png",
"中P":"icons/MP.png",
"強P":"icons/HP.png",
"弱K":"icons/LK.png",
"中K":"icons/MK.png",
"強K":"icons/HK.png"

}

function icon(name){

for(let k in iconMap){

if(name.includes(k)) return iconMap[k]

}

return ""

}

const moves={

standing:[

{name:"弱P",damage:300},
{name:"中P",damage:600},
{name:"強P",damage:900},

{name:"弱K",damage:300},
{name:"中K",damage:700},
{name:"強K",damage:900}

],

special:[

{name:"武神旋風脚",cmd:"214K",damage:1200},

{name:"武神旋風脚(OD)",cmd:"214KK",damage:1500},

{name:"疾駆け",cmd:"214K",damage:800,followups:[

{name:"急停止",cmd:"P",damage:0},

{name:"胴刎ね",cmd:"弱K",damage:900},

{name:"影すくい",cmd:"中K",damage:1000},

{name:"首狩り",cmd:"強K",damage:1100},

{name:"弧空",followups:[

{name:"武神イズナ落とし",cmd:"P",damage:1600},

{name:"武神鉾刃脚",cmd:"K",damage:1400}

]}

]}

],

unique:[

{name:"水切り蹴り",cmd:"3中K",damage:500},

{name:"風車",cmd:"4強K",damage:700}

],

system:[

{name:"ドライブインパクト",cmd:"HPHK",damage:600},

{name:"ドライブリバーサル",cmd:"HPHK",damage:800},

{name:"パリィ",cmd:"MPMK",damage:0},

{name:"ドライブラッシュ",cmd:"66",damage:0}

],

throw:[

{name:"縄掛背負い",cmd:"6LP LK",damage:1000},

{name:"鍾打巴",cmd:"4LP LK",damage:1000}

],

sa:[

{name:"SA1 武神乱拍手",cmd:"236236K",damage:2000},

{name:"SA2 武神天翔亢竜",cmd:"214214P",damage:2500},

{name:"SA3 武神顕現神楽",cmd:"236236P",damage:4000}

]

}

function draw(){

let html=""

html+=catStanding()

html+=cat("Special",moves.special,2)

html+=cat("特殊技",moves.unique)

html+=cat("共通システム",moves.system)

html+=cat("通常投げ",moves.throw)

html+=cat("SA",moves.sa)

document.getElementById("moves").innerHTML=html

}

function catStanding(){

let html='<div class="category"><h3>Standing</h3><div class="grid">'

moves.standing.forEach(m=>{

html+=`
<button class="standingBtn" onclick='add(${JSON.stringify(m)})'>

<img src="${icon(m.name)}">

${m.name}

</button>
`

})

html+="</div></div>"

return html

}

function cat(title,list,cols=1){

let grid=cols==2?"grid2":"grid"

let html=`<div class="category"><h3>${title}</h3><div class="${grid}">`

list.forEach(m=>{

let cmd=m.cmd?`【${m.cmd}】`:""

html+=`<button onclick='add(${JSON.stringify(m)})'>${m.name}${cmd}</button>`

})

html+="</div></div>"

return html

}

function add(m){

combo.push(m)

totalDamage+=m.damage||0

update()

if(m.followups) follow(m.followups)

else document.getElementById("followups").innerText="派生技なし"

}

function follow(list){

let html=""

list.forEach(m=>{

let cmd=m.cmd?`【${m.cmd}】`:""

html+=`<button onclick='add(${JSON.stringify(m)})'>${m.name}${cmd}</button>`

})

document.getElementById("followups").innerHTML=html

}

function update(){

let html=""

combo.forEach((m,i)=>{

html+=`<span class="comboMove" draggable="true"
ondragstart="drag(event,${i})"
ondrop="drop(event,${i})"
ondragover="allow(event)"
>

${m.name}

</span>`

if(i<combo.length-1) html+=`<span class="arrow">→</span>`

})

document.getElementById("comboArea").innerHTML=html

document.getElementById("damageValue").innerText=totalDamage

}

function clearCombo(){

combo=[]

totalDamage=0

update()

document.getElementById("followups").innerText="派生技なし"

}

function toggleDark(){

document.body.classList.toggle("dark")

}

let dragIndex

function drag(e,i){

dragIndex=i

}

function allow(e){

e.preventDefault()

}

function drop(e,i){

let temp=combo[dragIndex]

combo.splice(dragIndex,1)

combo.splice(i,0,temp)

update()

}

function saveCombo(){

let name=document.getElementById("comboName").value

if(!name||combo.length==0){

alert("名前とコンボを入力")

return

}

let data=JSON.parse(localStorage.getItem("comboRoutes")||"[]")

data.push({

name:name,

route:combo.map(m=>m.name)

})

localStorage.setItem("comboRoutes",JSON.stringify(data))

alert("保存しました")

}

draw()
