document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("savedRoutes");
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    
    container.innerHTML = saved.reverse().map(item => `
        <div class="combo-card">
            <div class="card-header">
                <span class="tag">${item.situation}</span>
                <strong>${item.name}</strong>
                <span class="dmg">${item.damage} dmg / ゲージ:${item.gauge}</span>
            </div>
            <p class="route-text">${item.route.join(" → ")}</p>
            ${item.memo ? `<p class="memo">📝 ${item.memo}</p>` : ''}
            <div class="card-actions">
                ${item.video ? `<button class="btn-video" onclick="window.open('${item.video}')">🎥 動画</button>` : ''}
                <button class="btn-delete" onclick="deleteCombo(${item.id})">削除</button>
            </div>
        </div>
    `).join("");
});

function deleteCombo(id) {
    if(!confirm("削除しますか？")) return;
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    localStorage.setItem("comboRoutes", JSON.stringify(saved.filter(i => i.id !== id)));
    location.reload();
}
