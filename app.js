let combo = [];

function addMove(name, command, icon){

combo.push({name, command, icon});

renderCombo();

}

function renderCombo(){

const comboLine = document.getElementById("comboLine");

comboLine.innerHTML = "";

combo.forEach((move,index)=>{

const moveDiv = document.createElement("span");
moveDiv.className="comboMove";

moveDiv.innerHTML = `
<img src="${move.icon}" class="icon">
${move.name} <span class="command">(${move.command})</span>
`;

comboLine.appendChild(moveDiv);

if(index < combo.length-1){

const arrow=document.createElement("span");
arrow.className="arrow";
arrow.textContent="→";

comboLine.appendChild(arrow);

}

});

}
