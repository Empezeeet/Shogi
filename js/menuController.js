let theme = "dark";

function playClick() {
    window.location.href='game.html' + '?theme=' + theme;

}
function changeTheme() {
    let selector = document.getElementById("theme-select");
    theme = selector.value;
    window.history.replaceState(null, null, '?theme=' + theme);
}