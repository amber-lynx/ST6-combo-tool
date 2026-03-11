// 編集・削除用JS
function drawSavedRoutes(){
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    let html = "";
    saved.forEach((s, index) => {
        html += `<div style="margin-bottom:8px;">
            <b>${index+1}. ${s.name}</b> : ${s.route.join(" → ")}
            <button onclick="editRoute(${index})">編集</button>
            <button onclick="deleteRoute(${index})">削除</button>
        </div>`;
    });
    document.getElementById("savedRoutes").innerHTML = html;
}

// 削除
function deleteRoute(index){
    if(confirm("本当に削除しますか？")){
        let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
        saved.splice(index,1);
        localStorage.setItem("comboRoutes", JSON.stringify(saved));
        drawSavedRoutes();
    }
}

// 編集
function editRoute(index){
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    let route = saved[index];
    // メインページに渡すためlocalStorageに格納
    localStorage.setItem("editCombo", JSON.stringify({index:index, route:route}));
    alert("メインページに戻ってコンボを編集してください。\nコンボを開いたらクリアせずに編集して登録してください。");
}

drawSavedRoutes();
