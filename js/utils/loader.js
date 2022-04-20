let loader = null

main()

function main() {
    loader = document.getElementById("loader")
}

function cambiarEstadoLoader(mostrarLoader) {
    if(mostrarLoader){
        loader.className = "d-flex loader-contenedor";
    }else{
        loader.className = "d-none loader-contenedor";
    }
}