/**
 * src/modules/renderer.js
 */

const ICON_MAP = {
    "弱P": "LP.png", "中P": "MP.png", "強P": "HP.png",
    "弱K": "LK.png", "中K": "MK.png", "強K": "HK.png",
    "P": "P.png", "K": "K.png",
    "1": "1.png", "2": "2.png", "3": "3.png", 
    "4": "4.png", "6": "6.png", "7": "7.png", 
    "8": "8.png", "9": "9.png",
    "236": "236.png", "214": "214.png", "22": "22.png",
    "j": "jump.png"
};

function parseCommandToIcons(cmd) {
    if (!cmd) return [];
    const icons = [];
    const longMotions = ["236", "214", "22", "66"];
    let remainingCmd = cmd;

    longMotions.forEach(m => {
        if (remainingCmd.includes(m)) {
            icons.push(ICON_MAP[m]);
            remainingCmd = remainingCmd.replace(m, "");
        }
    });

    for (const char of remainingCmd) {
        if (ICON_MAP[char]) {
            icons.push(ICON_MAP[char]);
        }
    }
    
    if (icons.length === 0 && ICON_MAP[cmd]) {
        return [ICON_MAP[cmd]];
    }
    
    return icons.filter(Boolean);
}

export function renderComboIcons(comboSteps) {
    if (!comboSteps || comboSteps.length === 0) return "";

    return comboSteps.map((move, index) => {
        const icons = parseCommandToIcons(move.cmd);
        let contentHtml = "";

        if (icons.length > 0) {
            const iconImages = icons.map(img => 
                `<img src="assets/icons/${img}" class="cmd-icon" alt="icon">`
            ).join("");
            
            contentHtml = `
                <div class="move-icon-wrapper">
                    <div class="icon-group">${iconImages}</div>
                    <span class="move-name-sub">${move.name}</span>
                </div>`;
        } else {
            contentHtml = `
                <div class="move-text-wrapper">
                    <span class="move-name-txt">${move.name}</span>
                </div>`;
        }

        const arrowHtml = index < comboSteps.length - 1 
            ? `<span class="combo-arrow">→</span>` 
            : "";

        return `<div class="combo-step">${contentHtml}${arrowHtml}</div>`;
    }).join("");
}
