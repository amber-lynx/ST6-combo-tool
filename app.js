let combo = []

const commands = {

normal:["LP","MP","HP","LK","MK","HK"],

crouch:["2LP","2MP","2HP","2LK","2MK","2HK"],

special:["236P","236K","214P","214K"],

sa:["SA1","SA2","SA3"],

system:["DR","DI","前ステ","後ステ"]

}

function renderCombo(){

const area=document.getElementById("combo")

area.innerHTML=""

combo.forEach((move,i)=>{

const span=document.createElement("span")

span.textContent=move

area.appendChild(span)

if(i !== combo.length-1){

const arrow=document.createElement("span")

arrow.textContent=" → "

area.appendChild(arrow)

}

})

}

function addMove(move){

combo.push(move)

renderCombo()

}

function undo(){

combo.pop()

renderCombo()

}

function clearCombo(){

combo=[]

renderCombo()

}

function saveCombo(){

let text=combo.join(" → ")

navigator.clipboard.writeText(text)

alert("コピーしました\n"+text)

}

function createButtons(list){

const area=document.getElementById("commandArea")

area.innerHTML=""

list.forEach(move=>{

const btn=document.createElement("button")

btn.textContent=move

btn.className="moveBtn"

btn.onclick=()=>addMove(move)

area.appendChild(btn)

})

}

function changeTab(tab){

createButtons(commands[tab])

}

changeTab("normal")
