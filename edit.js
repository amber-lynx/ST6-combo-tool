document.addEventListener("DOMContentLoaded", () => {
    document.body.className = 'theme-' + (localStorage.getItem("selectedTheme") || "dark");
    renderSavedList();
});

function renderSavedList() {
    const container = document.getElementById("savedRoutes");
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    if (saved.length === 0) { container.innerHTML = "<p>保存されたコンボはありません。</p>"; return; }

    container.innerHTML = saved.reverse().map(item => `
        <div class="combo-card">
            <div class="card-header">
                <span class="tag">${item.situation}</span>
                <strong>${item.name}</strong>
                <span class="stats">${item.damage} dmg / ゲージ:${item.gauge.toFixed(1)}</span>
            </div>
            <p class="route-display">${item.route.join(" → ")}</p>
            ${item.memo ? `<p class="memo-text">📝 ${item.memo}</p>` : ''}
            <div class="card-actions">
                ${item.video ? `<button class="v-btn" onclick="window.open('${item.video}')">🎥 動画</button>` : ''}
                <button class="d-btn" onclick="deleteCombo(${item.id})">削除</button>
            </div>
        </div>
    `).join("");
}

function deleteCombo(id) {
    if(!confirm("削除しますか？")) return;
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    localStorage.setItem("comboRoutes", JSON.stringify(saved.filter(i => i.id !== id)));
    renderSavedList();
}
