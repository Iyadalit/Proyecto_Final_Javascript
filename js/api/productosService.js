//const BASE_URL = "http://localhost:9090/api/"
const BASE_URL = "https://api-products-yada.herokuapp.com/api/"

function obtenerProductosRequest() {
    let authorizationToken = getStorageItem("token")
    return fetch(`${BASE_URL}products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authorizationToken}`
        }
    })
}

function eliminarProductoRequest(productoId) {
    let authorizationToken = getStorageItem("token")
    return fetch(`${BASE_URL}products/?id=${productoId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authorizationToken}`
        }
    })
}

function agregarProductoRequest(name, quantity, purchasePrice, salePrice) {
    let authorizationToken = getStorageItem("token")
    let dataRequest = JSON.stringify({
        "name": name,
        "quantity": quantity,
        "purchasePrice": purchasePrice,
        "salePrice": salePrice
    })
    return fetch(`${BASE_URL}products`, {
        method: "POST",
        body: dataRequest,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authorizationToken}`
        }
    })
}

function editarProductoRequest
(name, quantity, purchasePrice, salePrice, productoId) {
    let authorizationToken = getStorageItem("token")
    let dataRequest = JSON.stringify({
        "name": name,
        "quantity": quantity,
        "purchasePrice": purchasePrice,
        "salePrice": salePrice
    })
    return fetch(`${BASE_URL}products/?id=${productoId}`, {
        method: "PUT",
        body: dataRequest,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authorizationToken}`
        }
    })
}

function agregarImagenProductoRequest(productoId, file) {
    console.log("🚀 ~ file: productosService.js ~ line 45 ~ agregarImagenProductoRequest ~ file", file)
    let authorizationToken = getStorageItem("token")
    let dataRequest = new FormData()
    dataRequest.append("image", file)
    return fetch(`${BASE_URL}products/image/?id=${productoId}`, {
        method: "PUT",
        body: dataRequest,
        headers: {
            "Authorization": `Bearer ${authorizationToken}`
        }
    })
}