let isLoggedIn = () => {
    return localStorage.getItem("isLoggedIn") == 'true';
}

let login = () => {
    localStorage.setItem("isLoggedIn", true);
}

let logout = () => {
    localStorage.setItem("isLoggedIn", false);
}

module.exports = { isLoggedIn, login, logout };