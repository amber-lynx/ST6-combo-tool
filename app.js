let combo=[]
let commandData

fetch("commands.json")
.then(res=>res.json())
.then(data=>{
commandData=data
renderCommands()
})

function renderCommands(){

const container=document.getElementById("command-list")
container.innerHTML=""

for(const key in commandData.categories){

const category=commandData.categories[key]

const section=document.createElement("div")
section.className="command-section"
section.id=key

const title=document.createElement("h3")
title.innerText=category.title

section.appendChild(title)

category.moves.forEach(move=>{
section.appendChild(createMove(move))
})

container.appendChild(section)

}

}


function createMove(move){

const box=document.createElement("div")

const btn=document.createElement("button")
btn.innerText=move.name

btn.onclick=()=>addCombo(move)

box.appendChild(btn)

if(move.followups){

const follow=document.createElement("div")
follow.className="followup"

move.followups.forEach(f=>{
follow.appendChild(createMove(f))
})

box.appendChild(follow)

}

return box

}


function addCombo(move){

combo.push(move)
renderCombo()

}


function renderCombo(){

const comboBox=document.getElementById("combo")
const damageBox=document.getElementById("damage")

comboBox.innerHTML=""

let total=0

combo.forEach(move=>{

const span=document.createElement("span")
span.innerText=move.name+" ＞ "

comboBox.appendChild(span)

if(move.damage){
total+=move.damage
}

})

damageBox.innerText="合計ダメージ: "+total

}


function removeLast(){

combo.pop()
renderCombo()

}


function removeAll(){

combo=[]
renderCombo()

}


function copyCombo(){

let text=""

combo.forEach(move=>{
text+=move.name+" ＞ "
})

navigator.clipboard.writeText(text)

alert("コンボコピーしました")

}


function changeBg(num){

document.body.className="bg"+num

}
