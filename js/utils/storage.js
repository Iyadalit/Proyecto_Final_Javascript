function setStorageItem(itemName, value) {
    localStorage.setItem(itemName, value)
}

function getStorageItem(itemName) {
    const element = localStorage.getItem(itemName)

    return element
}

function clearStorage() {
    localStorage.clear()
}