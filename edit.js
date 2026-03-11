document.addEventListener("DOMContentLoaded", () => {
    document.body.className = 'theme-' + (localStorage.getItem("selectedTheme") || "dark");
    renderSavedList();
});

function renderSavedList() {
    const container = document.getElementById("savedRoutes");
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    if (saved.length === 0) { container.innerHTML = "<p>保存なし</p>"; return; }
    container.innerHTML = saved.reverse().map(item => `
        <div class="combo-card">
            <div class="card-header">
                <span class="situation-tag">${item.situation || '中央'}</span>
                <strong>${item.name}</strong>
                <span class="damage-tag">${item.damage || 0} dmg</span>
            </div>
            <p class="route-text">${item.route.join(" → ")}</p>
            <div class="card-actions">
                <button class="btn-copy" onclick="copyText('${item.route.join(" > ")}')">コピー</button>
                <button class="btn-delete" onclick="deleteCombo(${item.id})">削除</button>
            </div>
        </div>
    `).join("");
}

function deleteCombo(id) {
    if (confirm("削除しますか？")) {
        let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
        localStorage.setItem("comboRoutes", JSON.stringify(saved.filter(i => i.id !== id)));
        renderSavedList();
    }
}
function copyText(t) { navigator.clipboard.writeText(t); alert("コピー成功"); }
