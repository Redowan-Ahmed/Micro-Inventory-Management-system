// Initial products array
// const initialProducts = [
//   {
//     id:2,
//     name: 'Laptop',
//     quantity: 10,
//     price: 800,
//     vendor: 'Dell',
//     category: 'Electronics',
//   },
//   {
//     id: 6,
//     name: 'Phone',
//     quantity: 25,
//     price: 500,
//     vendor: 'Samsung',
//     category: 'Electronics',
//   },
//   {
//     id:3,
//     name: 'Desk Chair',
//     quantity: 15,
//     price: 150,
//     vendor: 'Ikea',
//     category: 'Furniture',
//   },
// ];

const productRoot = document.querySelector('#productTableBody')
const body = document.querySelector('body')
const getProducts = localStorage.getItem('products')
const products = JSON.parse(getProducts)
const form = document.querySelector('#productForm')

let model
// localStorage.setItem('products', JSON.stringify(initialProducts))
// localStorage.setItem('products', JSON.stringify([...products, product]))

console.log(products);

function actionDelete(id) {
  const getProductsForDelete = localStorage.getItem('products')
  const deleteProduct = JSON.parse(getProductsForDelete)
  const newProducts = deleteProduct.filter((product) => product.id != id)
  localStorage.setItem('products', JSON.stringify(newProducts))
  console.log(newProducts);
}

function actionEdit(id) {
  const getProductsForEdit = localStorage.getItem('products')
  const editProducts = JSON.parse(getProductsForEdit)
  const product = editProducts.find(product => product.id == id)
  modelPopup(product)

  productEditForm = document.querySelector('#productEditForm')
  productEditForm.addEventListener('submit', (e)=>{

    e.preventDefault()
    console.log(e);
    const name = e.target.name.value
    const quantity = e.target.quantity.value
    const price = e.target.price.value
    const vendor = e.target.vendor.value
    const category = e.target.category.value
    localStorage.setItem('products', JSON.stringify(editProducts.map((product) => (product.id == id ? { ...product, name, quantity, price, vendor, category } : product))));
    productElement = document.querySelector(`.product${id}`)
    productElement.innerHTML = `
    <td class="py-2 px-4 border-b text-center">${name}</td>
    <td class="py-2 px-4 border-b text-center">${quantity}</td>
    <td class="py-2 px-4 border-b text-center">${price} Tk</td>
    <td class="py-2 px-4 border-b text-center">${vendor}</td>
    <td class="py-2 px-4 border-b text-center">${category}</td>
    <td class="py-2 px-4 border-b text-center gap-5">
    <button class="text-red-600 remove fa-solid fa-trash mx-1" id="${id}">
    </button>
    <button class="text-green-600 edit fa-solid fa-pen-to-square mx-1" id="${id}">
    </button>
    </td>
    `
    model = document.querySelector('#edit-model')
    model.remove()
    quickActions()
  })
}

form.addEventListener('submit',actionPost)

function actionPost(e) {
  e.preventDefault()

    const getId = String(e.timeStamp).split('.')[0]
    console.log(e);
    const id = Number(getId)
    const name = e.target.name
    const quantity = e.target.quantity
    const price = e.target.price
    const vendor = e.target.vendor
    const category = e.target.category

    const product = {
      id: id,
      name: name.value,
      quantity: quantity.value,
      price: price.value,
      vendor: vendor.value,
      category: category.value,
    }

    const getProductsForPost = localStorage.getItem('products')
    const products = JSON.parse(getProductsForPost)
    if(products){
      const newProducts = [...products, product]
      localStorage.setItem('products', JSON.stringify(newProducts))
    }else{
      localStorage.setItem('products', JSON.stringify([product]))
    }
    name.value = ''
    quantity.value = ''
    price.value = ''
    vendor.value = ''
    category.value = ''
    renderProduct(product)
    quickActions()

}


// Function to render product
function renderProduct(product) {
  let elememt = document.createElement('tr')
  elememt.className = `product${product.id}`
  elememt.id = product.id
  elememt.accessKey = product.id
  elememt.innerHTML = `
  <td class="py-2 px-4 border-b text-center">${product.name}</td>
  <td class="py-2 px-4 border-b text-center">${product.quantity}</td>
  <td class="py-2 px-4 border-b text-center">${product.price} Tk</td>
  <td class="py-2 px-4 border-b text-center">${product.vendor}</td>
  <td class="py-2 px-4 border-b text-center">${product.category}</td>
  <td class="py-2 px-4 border-b text-center gap-5">
  <button class="text-red-600 remove fa-solid fa-trash mx-1" id="${product.id}">
  </button>
  <button class="text-green-600 edit fa-solid fa-pen-to-square mx-1" id="${product.id}">
  </button>
  </td>
  `
  productRoot.appendChild(elememt)
}


function render() {
  if (products){
    products.map((product) => {
    renderProduct(product)
  })
  quickActions()
  }else{
    console.log('No products');
  }


}


render()

function quickActions() {
  const deleteElements = document.querySelectorAll('.remove')
  const editElements = document.querySelectorAll('.edit')

  deleteElements.forEach((deleteElement)=>{
    deleteElement.addEventListener('click', (e) => {
      const productElement = document.querySelector(`.product${e.target.id}`).remove()
      console.log(productElement);
      actionDelete(e.target.id)
    })
  })

  editElements.forEach((editElement)=>{
    editElement.addEventListener('click', (e) => {
      console.log(e.target);
      actionEdit(e.target.id)
    })
  })
}




function modelPopup(product) {
  let elememt = document.createElement('model')
  elememt.className = `fixed z-10 top-0 bg-gray-900 h-full w-full bg-opacity-10`
  elememt.id = 'edit-model'
  elememt.accessKey = product.id
  elememt.innerHTML = `
  <div class="flex justify-center items-center h-full">
  <div class="bg-white w-11/12 md:w-6/12 py-16 px-10 rounded">
    <h1 class="text-3xl text-center font-bold mb-6">Edit</h1>

    <!-- Form to edit product -->
    <form id="productEditForm" class="mb-6 text-center">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <input type="hidden" id="productId">
        <input type="text" id="productName" placeholder="Product Name" class="p-2 border border-gray-300 rounded" name="name" value="${product.name}"/>
        <input type="number" id="productQuantity" placeholder="Quantity" class="p-2 border border-gray-300 rounded" name="quantity"  value="${product.quantity}"/>
        <input type="number" id="productPrice" placeholder="Price" class="p-2 border border-gray-300 rounded" name="price" value="${product.price}"/>
        <input type="text" id="productVendor" placeholder="Vendor" class="p-2 border border-gray-300 rounded" name="vendor" value="${product.vendor}"/>
        <input type="text" id="productCategory" placeholder="Category" class="p-2 border border-gray-300 rounded" name="category" value="${product.category}"/>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-3 py-2  rounded">Save Edits</button>
    </form>
  </div>
  <i class="close fa-solid fa-xmark text-red-600 absolute top-2 right-2 md:top-5 z-10 cursor-pointer md:right-5 bg-white p-2  md:py-3 md:px-4 rounded-full" id="close" title="close"></i>
  </div>
  `
  body.appendChild(elememt)
  model = document.querySelector('#edit-model')


  const close = document.querySelector('#close')
  close.addEventListener('click',(e)=>{
    model.remove()
  })
}


