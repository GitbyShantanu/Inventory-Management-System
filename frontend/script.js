// const API = "https://inventory-management-system-cjr4.onrender.com/products"

const API = "http://127.0.0.1:8000/products";

const idField = document.querySelector("#productId") // fetch element by css #id selector
const nameField = document.querySelector("#productName");
const descriptionField = document.querySelector("#description");
const priceField = document.querySelector("#price");
const qtyField = document.querySelector("#qty");
const submitButton = document.querySelector("#submit");

const form = document.querySelector("#productForm");
const table = document.querySelector("#tableBody");


// fetch products from backend endpoint and fill table with product details and edit and delete buttons 
async function loadProducts() {
    const res = await fetch(API);
    let dataArr = await res.json();

    table.innerHTML = ""; // just to ensure that table is empty before filling it

    dataArr.forEach(p => {
        const row = document.createElement("tr");  // for every element in data array create a table row html element 
        
        // fill row with product details and buttons to edit and delete product
        row.innerHTML = `    
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.description}</td>
        <td>${p.price}</td>
        <td>${p.quantity}</td>
        
        <td>
            <button class="btn btn-warning" 
                onClick="editProduct('${p.id}', '${p.name}', '${p.description}', '${p.price}', '${p.quantity}')">
                Edit
            </button>

            <button class="btn btn-danger ml-2 "
                onClick="deleteProduct('${p.id}')">
                Delete
            </button>
        </td>
        `

        table.appendChild(row);  // append created row to table body
    });
    console.log("Products loaded successfully");
}


// on form submit event either post new product or update product. 
form.addEventListener("submit", async (e) => {  // async function to handle form submit event. e is event object which is passed by default to callback function of event listener
    e.preventDefault();  // prevent whole page refresh on form submit and show updated table

    const body = {  // object to be sent in request body
        name: nameField.value,
        description: descriptionField.value,
        price: priceField.value,
        quantity: qtyField.value
    }
 
    const id = idField.value  //id field will be filled in case of edit product and will be empty in case of new product

    if(id) {  // if id field has value then update the existing product

        if(!confirm("Are you sure you want to update this product?")) {
            return;
        }

        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        let data = await res.json()
        console.log("PUT response: ",data);
        window.alert(`Product with id ${id} updated successfully`);

    }
    else {  // if id field is empty then post new product
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        let data = await res.json()
        console.log("POST response: ", data);
        window.alert(`Product ${body.name} saved successfully`);
    }

    loadProducts();
    clearForm();
});


// clear form after submit or update product
function clearForm() {
    nameField.value = "";
    descriptionField.value = "";
    priceField.value = "";
    qtyField.value = "";
}


// edit product by filling the form with existing values of product and submit form to update product
function editProduct(id, name, description, price, qty) {
    idField.value = id;
    nameField.value = name;
    descriptionField.value = description;
    priceField.value = price;
    qtyField.value = qty;
}


// delete product by id and then reload the table to reflect the changes
async function deleteProduct(id) {
    if(!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    const res = await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    let data = await res.json();
    console.log("DELETE response: ", data);
    alert(`Product with id ${id} deleted successfully`);
    loadProducts();
}


loadProducts();
alert("Welcome to Product Inventory Management System!\nYou can add, edit and delete products using this system.");
// alert("Data is fetched successfully");
console.log("Script loaded successfully");