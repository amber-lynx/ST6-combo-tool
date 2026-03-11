document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme") || "dark";
    document.body.className = 'theme-' + savedTheme;
    renderSavedList();
});

function renderSavedList() {
    const container = document.getElementById("savedRoutes");
    const saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    if (saved.length === 0) { container.innerHTML = "<p>保存されたコンボはありません。</p>"; return; }

    container.innerHTML = saved.reverse().map(item => `
        <div class="combo-card">
            <div class="combo-info">
                <div class="card-header">
                    <span class="situation-tag">${escapeHtml(item.situation || '中央')}</span>
                    <strong>${escapeHtml(item.name)}</strong>
                    <span class="damage-tag">${item.damage || 0} dmg</span>
                </div>
                <p class="route-text">${item.route.join(" → ")}</p>
            </div>
            <div class="combo-actions">
                <button class="copy-btn" onclick="copyText('${item.route.join(" > ")}')">コピー</button>
                <button class="del-btn" onclick="deleteCombo(${item.id})">削除</button>
            </div>
        </div>
    `).join("");
}

function deleteCombo(id) {
    if (!confirm("削除しますか？")) return;
    let saved = JSON.parse(localStorage.getItem("comboRoutes") || "[]");
    saved = saved.filter(item => item.id !== id);
    localStorage.setItem("comboRoutes", JSON.stringify(saved));
    renderSavedList();
}

function copyText(text) { navigator.clipboard.writeText(text); alert("コピーしました！"); }
function escapeHtml(str) { const p = document.createElement("p"); p.textContent = str; return p.innerHTML; }
