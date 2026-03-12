let combo = []

async function loadCommands(){

try{

const res = await fetch("./commands.json")
const data = await res.json()

console.log("commands loaded:",data)

createButtons(data.normal,"normal")
createButtons(data.unique,"unique")
createButtons(data.special,"special")
createButtons(data.follow,"follow")
createButtons(data.sa,"sa")
createButtons(data.system,"system")
createButtons(data.throw,"throw")

}catch(e){

console.error("JSON読み込み失敗",e)

}

}

function createButtons(list,id){

const area = document.getElementById(id)

if(!area || !list) return

list.forEach(move=>{

const btn = document.createElement("button")

btn.className = "move-btn"

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

box.innerHTML = ""

combo.forEach((move,index)=>{

const span = document.createElement("span")

span.className = "combo-move"

span.textContent = move

box.appendChild(span)

if(index < combo.length-1){

const arrow = document.createElement("span")
arrow.className = "combo-arrow"
arrow.textContent = " ＞ "

box.appendChild(arrow)

}

})

}

function undo(){

combo.pop()

renderCombo()

}

function clearCombo(){

combo = []

renderCombo()

}

/* 技検索 */

const search = document.querySelector("header input")

search.addEventListener("input",()=>{

const word = search.value.toLowerCase()

const buttons = document.querySelectorAll(".move-btn")

buttons.forEach(btn=>{

const name = btn.textContent.toLowerCase()

btn.style.display = name.includes(word) ? "inline-block" : "none"

})

})

loadCommands()
