// 編集・削除用スクリプト
function drawSavedRoutes(){
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    let html = "";
    if(saved.length === 0){
        html = "<p>登録されたコンボはありません</p>";
    } else {
        saved.forEach((s, index) => {
            html += `<div style="margin-bottom:8px; padding:6px; border:1px solid #444; border-radius:6px;">
                <b>${index+1}. ${s.name}</b> : ${s.route.join(" → ")}
                <button onclick="editRoute(${index})">編集</button>
                <button onclick="deleteRoute(${index})">削除</button>
            </div>`;
        });
    }
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
    const route = saved[index];

    // 編集対象データを localStorage に格納
    localStorage.setItem("editCombo", JSON.stringify({index:index, route:route}));

    // index.html に遷移して編集モード
    window.location.href = "index.html";
}

// 初期描画
drawSavedRoutes();
