const urlParams = new URLSearchParams(window.location.search);
const themeMode = urlParams.get('theme');
if (themeMode === 'dark') {
  document.querySelector(':root').style.setProperty('--bg-Color', '#121212');
} else if (themeMode === 'light') {
    document.querySelector(':root').style.setProperty('--bg-Color', '#ffffff');
}
function restartGame() {
  window.location.reload();
}
function backToMenu() {
  window.location.href = 'index.html' + (themeMode == null ? '' : ('?theme=' + themeMode));
}

