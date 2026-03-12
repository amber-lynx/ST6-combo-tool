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

const btn=document.createElement("button")

btn.innerText=move.name

btn.onclick=()=>{
addCombo(move)
}

section.appendChild(btn)

})

container.appendChild(section)

}

}

function addCombo(move){

combo.push(move)
renderCombo()

}

function renderCombo(){

const box=document.getElementById("combo")

box.innerHTML=""

combo.forEach(move=>{

const span=document.createElement("span")

span.innerText=move.name+" → "

box.appendChild(span)

})

}

function removeLast(){

combo.pop()
renderCombo()

}

function removeAll(){

combo=[]
renderCombo()

}

function changeBg(num){

document.body.className="bg"+num

}
