export function parseCommand(recipeArray) {
  return recipeArray.map(cmd => {
    // 文字列を元に <img src="icons/${cmd}.png"> を生成するロジック
  }).join('<span class="arrow">→</span>');
}
