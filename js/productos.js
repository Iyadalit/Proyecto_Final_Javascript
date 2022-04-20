let productos = [];

let contenedorProductos = null;
let modalAddProduct = null;
let inputName = null;
let inputQuantity = null;
let inputPurchasePrice = null;
let inputSalePrice = null;
let inputImage = null;
let file = null;
let modal = null;
let buttonOpenModal = null;
let buttonCloseModal = null;
let buttonCloseModalTop = null;
let textModalTitle = null;
let isUpdate = false;
let productoIdAEditar = 0;
let buttonCerrarSesion = null;
main();
closeModal;
function main() {
  inicializarElementos();
  agregarEventos();
  obtenerProductos();
  revisarSesion();
}

function inicializarElementos() {
  contenedorProductos = document.getElementById("contenedorProductos");
  formularioAgregarProducto = document.getElementById("addProductForm");
  inputName = document.getElementById("txtName");
  inputQuantity = document.getElementById("txtQuantity");
  inputPurchasePrice = document.getElementById("txtPurchasePrice");
  inputSalePrice = document.getElementById("txtSalePrice");
  inputImage = document.getElementById("inputImage");
  modalAddProduct = document.getElementById("modalAddProduct");
  buttonCloseModal = document.getElementById("btnCloseModal");
  buttonOpenModal = document.getElementById("btnAddProduct");
  buttonCloseModalTop = document.getElementById("btnCloseModalTop");
  textModalTitle = document.getElementById("txtModalTitle");
  buttonCerrarSesion = document.getElementById("btnCerrarSesion");
  modal = new bootstrap.Modal(modalAddProduct);
}

function agregarEventos() {
  formularioAgregarProducto.onsubmit = handleAddProduct;
  buttonOpenModal.onclick = openModalAddProduct;
  buttonCloseModalTop.onclick = closeModal;
  buttonCloseModal.onclick = closeModal;
  inputImage.onchange = handleImageSelect;
  buttonCerrarSesion.onclick = cerrarSesion;
}

function handleImageSelect(event) {
  const files = event.target.files;
  file = files[0];
  console.log(
    "🚀 ~ file: productos.js ~ line 36 ~ handleImageSelect ~ file",
    files[0]
  );
}

async function obtenerProductos() {
  try {
    const response = await obtenerProductosRequest();
    const responseData = await response.json();
    if (!response.ok) {
      throw Error(response.statusText);
    }
    productos = [...responseData?.products];
    pintarProductos();
  } catch (error) {
    console.log(
      "🚀 ~ file: productos.js ~ line 16 ~ obtenerProductos ~ error",
      error
    );
    showToast("error", `${error}`, 3600);
  }
}

function pintarProductos() {
  while (contenedorProductos.firstChild) {
    contenedorProductos.removeChild(contenedorProductos.firstChild);
  }

  productos.forEach((product) => {
    let cardContainer = document.createElement("div");
    cardContainer.className = "col-md-3 mt-5";

    let card = document.createElement("div");
    card.className = "card shadow h-100 rounded-3";

    let image = document.createElement("img");
    image.className = "card-img-top h-100";
    image.src =
      product?.imageUrl ??
      "https://www.luftechnik.com/wp-content/uploads/2021/02/placeholder.png";
    image.alt = product?.name;
    card.appendChild(image);
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let nameProduct = document.createElement("h5");
    nameProduct.innerText = product?.name;
    nameProduct.className = "card-title";

    let contentBodyCard = document.createElement("div");

    let quantityProduct = document.createElement("p");
    quantityProduct.innerText = `Cantidad: ${formatNumber(product?.quantity)}`;
    let purchasePriceProduct = document.createElement("p");
    purchasePriceProduct.innerText = `Precio compra: ${formatMoney(
      product?.purchasePrice
    )}`;
    let salePriceProduct = document.createElement("p");
    salePriceProduct.innerText = `Precio venta: ${formatMoney(
      product?.salePrice
    )}`;

    contentBodyCard.appendChild(quantityProduct);
    contentBodyCard.appendChild(purchasePriceProduct);
    contentBodyCard.appendChild(salePriceProduct);

    cardBody.appendChild(nameProduct);
    cardBody.appendChild(contentBodyCard);

    let contentButtons = document.createElement("div");
    contentButtons.className = "row";

    let contentUpdateButton = document.createElement("div");
    contentUpdateButton.className = "col-md-6 d-grid gap-2 ";
    let updateButton = document.createElement("button");
    updateButton.className = "btn btn-success";
    updateButton.innerHTML = "Editar";
    updateButton.onclick = () => mostrarModalEditarProducto(product?._id);
    contentUpdateButton.appendChild(updateButton);

    let contentDeleteButton = document.createElement("div");
    contentDeleteButton.className = "col-md-6 d-grid gap-2";
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.innerHTML = "Eliminar";
    deleteButton.onclick = () => confirmacionEliminarProducto(product?._id);

    contentDeleteButton.appendChild(deleteButton);
    contentButtons.appendChild(contentUpdateButton);
    contentButtons.appendChild(contentDeleteButton);

    cardBody.appendChild(contentButtons);

    card.appendChild(cardBody);
    cardContainer.appendChild(card);
    contenedorProductos.appendChild(cardContainer);
  });
}

function confirmacionEliminarProducto(productoId) {
  Swal.fire({
    title: "¿Está seguro que quiere eliminar el producto?",
    text: "¡Este proceso no se puede revertir!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "¡Sí, eliminarlo!",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarProducto(productoId);
    }
  });
}

async function eliminarProducto(productoId) {
  try {
    let response = await eliminarProductoRequest(productoId);
    if (!response.ok) {
      throw Error(response.statusText);
    }

    let productosFiltrados = productos.filter(
      (producto) => producto?._id !== productoId
    );

    productos = [...productosFiltrados];
    pintarProductos();
    showToast("success", `El producto se eliminó correctamente`, 3600);
  } catch (error) {
    console.log(
      "🚀 ~ file: productos.js ~ line 129 ~ eliminarProducto ~ error",
      error
    );
    showToast("error", `${error}`, 3600);
  }
}

function handleAddProduct(event) {
  event.preventDefault();
  let name = inputName.value;
  let quantity = inputQuantity.value;
  let purchasePrice = inputPurchasePrice.value;
  let salePrice = inputSalePrice.value;

  if (isUpdate) {
    editarProducto(name, quantity, purchasePrice, salePrice);
  } else {
    registrarProducto(name, quantity, purchasePrice, salePrice);
  }
}

async function registrarProducto(name, quantity, purchasePrice, salePrice) {
  try {
    let response = await agregarProductoRequest(
      name,
      quantity,
      purchasePrice,
      salePrice
    );
    let responseData = await response.json();
    console.log(
      "🚀 ~ file: productos.js ~ line 196 ~ responseData",
      responseData
    );
    if (!response.ok) {
      throw Error(response.statusText);
    }

    agregarImagen(responseData?.product?._id);
  } catch (error) {
    console.log(
      "🚀 ~ file: productos.js ~ line 152 ~ editarProductoRequest ~ error",
      error
    );
    showToast("error", `${error}`, 3600);
  }
}

async function editarProducto(name, quantity, purchasePrice, salePrice) {
  try {
    let response = await editarProductoRequest(
      name,
      quantity,
      purchasePrice,
      salePrice,
      productoIdAEditar
    );
    let responseData = await response.json();
    console.log(
      "🚀 ~ file: productos.js ~ line 196 ~ responseData",
      responseData
    );
    if (!response.ok) {
      throw Error(response.statusText);
    }
    if (file) {
      agregarImagen(responseData?.product?._id);
    } else {
      showToast("success", `El producto se modificó correctamente`, 3600);
      productos = [
        ...productos.filter((producto) => producto?._id !== productoIdAEditar),
        responseData?.product,
      ];
      pintarProductos();
      limpiarFormulario();
      closeModal();
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: productos.js ~ line 152 ~ registrarProducto ~ error",
      error
    );
    showToast("error", `${error}`, 3600);
  }
}

async function agregarImagen(productoId) {
  try {
    let response = await agregarImagenProductoRequest(productoId, file);
    let responseData = await response.json();
    if (!response.ok) {
      throw Error(response.statusText);
    }

    showToast(
      "success",
      `El producto se ${isUpdate ? "actualizó" : "registró"}  correctamente`,
      3600
    );
    if (isUpdate) {
      productos = [
        ...productos.filter((producto) => producto?._id !== productoId),
        responseData?.product,
      ];
    } else {
      productos = [...productos, responseData?.product];
    }
    pintarProductos();
    limpiarFormulario();
    closeModal();
  } catch (error) {
    console.log(
      "🚀 ~ file: productos.js ~ line 215 ~ agregarImagen ~ error",
      error
    );
    showToast("error", `${error}`, 3600);
  }
}

function mostrarModalEditarProducto(productoId) {
  let selectedProduct = productos.filter(
    (product) => product?._id === productoId
  );
  inputName.value = selectedProduct[0]?.name;
  inputQuantity.value = selectedProduct[0]?.quantity;
  inputPurchasePrice.value = selectedProduct[0]?.purchasePrice;
  inputSalePrice.value = selectedProduct[0]?.salePrice;
  isUpdate = true;
  productoIdAEditar = productoId;
  textModalTitle.innerHTML = "Editar Producto";
  openModal();
}

function openModalAddProduct() {
  textModalTitle.innerHTML = "Agregar Producto";
  openModal();
}

function openModal() {
  modal.show();
}

function revisarSesion() {
    let token = getStorageItem("token")
    if(!token){
      window.location.href = "/";
    }
  }

function cerrarSesion() {
    clearStorage()
    window.location.href = "/";
}

function closeModal() {
  inputName.value = "";
  inputQuantity.value = "";
  inputPurchasePrice.value = "";
  inputSalePrice.value = "";
  modal.hide();
  isUpdate = false;
  productoIdAEditar = 0;
}

function limpiarFormulario() {
  inputName.value = "";
  inputQuantity.value = "";
  inputPurchasePrice.value = "";
  inputSalePrice.value = "";
  inputImage.value = "";
  file = null;
}

function formatMoney(textToFormat) {
  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);
  return numberFormat.format(textToFormat);
}

function formatNumber(textToFormat) {
  const numberFormat = new Intl.NumberFormat("es-ES");
  return numberFormat.format(textToFormat);
}
