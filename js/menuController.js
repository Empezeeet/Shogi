let theme = "dark";

function playClick() {
    window.location.href='game.html' + '?theme=' + theme;

}
function changeTheme() {
    let selector = document.getElementById("theme-select");
    theme = selector.value;
    window.history.replaceState(null, null, '?theme=' + theme);
    if (theme === 'dark') {
        document.querySelector(':root').style.setProperty('--bg-Color', '#121212');
        document.querySelector(':root').style.setProperty('--text-Color', '255, 255, 255');
    } else if (theme === 'light') {
        document.querySelector(':root').style.setProperty('--bg-Color', '#fff');
        document.querySelector(':root').style.setProperty('--text-Color', '18, 18, 18');
    }

}