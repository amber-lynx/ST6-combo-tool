let combo = []

async function loadCommands(){

const res = await fetch("commands.json")

const data = await res.json()

createButtons(data.normal,"normal")
createButtons(data.unique,"unique")
createButtons(data.special,"special")
createButtons(data.follow,"follow")
createButtons(data.sa,"sa")
createButtons(data.system,"system")
createButtons(data.throw,"throw")

}

function createButtons(list,id){

const area = document.getElementById(id)

if(!area) return

list.forEach(move=>{

const btn = document.createElement("button")

btn.textContent = move.name

btn.onclick = ()=>addMove(move.name)

area.appendChild(btn)

})

}

function addMove(move){

combo.push(move)

renderCombo()

}

function renderCombo(){

const box = document.getElementById("combo")

box.innerHTML = combo.join(" ＞ ")

}

function undo(){

combo.pop()

renderCombo()

}

function clearCombo(){

combo = []

renderCombo()

}

loadCommands()
