//const BASE_URL = "http://localhost:9090/api/"
const BASE_URL = "https://api-products-yada.herokuapp.com/api/"

function login(email, password) {
    let dataRequest = JSON.stringify({
        email: email,
        password: password
    })
    return fetch(`${BASE_URL}login`, {
        method: "POST",
        body: dataRequest,
        headers: {
            "Content-Type": "application/json"
        }
    })
}