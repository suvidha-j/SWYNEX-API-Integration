const API_URL = "https://fakestoreapi.com/products";

const productGrid = document.getElementById("productGrid");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let products = [];


/* =========================
   FETCH PRODUCTS FROM API
========================= */

async function fetchProducts() {

    loading.style.display = "block";
    errorMessage.style.display = "none";
    productGrid.innerHTML = "";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products = await response.json();

        createCategoryOptions();

        displayProducts(products);

    } catch (error) {

        console.error("API Error:", error);

        loading.style.display = "none";
        errorMessage.style.display = "block";
    }
}


/* =========================
   CATEGORY OPTIONS
========================= */

function createCategoryOptions() {

    const categories = [
        ...new Set(
            products.map(product => product.category)
        )
    ];

    categoryFilter.innerHTML =
        `<option value="all">All Categories</option>`;

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = formatCategory(category);

        categoryFilter.appendChild(option);
    });
}


/* =========================
   DISPLAY PRODUCTS
========================= */

function displayProducts(productData) {

    loading.style.display = "none";

    productGrid.innerHTML = "";

    if (productData.length === 0) {

        productGrid.innerHTML = `
            <div class="empty-message">

                <div style="font-size:40px;">
                    🔎
                </div>

                <h3>No Products Found</h3>

                <p>
                    Try another search or category.
                </p>

            </div>
        `;

        return;
    }


    productData.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${escapeHTML(product.title)}"
                class="product-image"
            >

            <div class="product-content">

                <div class="product-category">
                    ${formatCategory(product.category)}
                </div>

                <h3 class="product-title">
                    ${escapeHTML(product.title)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">

                    <div class="price">
                        $${product.price.toFixed(2)}
                    </div>

                    <div class="rating">
                        ⭐ ${product.rating.rate}
                    </div>

                </div>

            </div>

        `;


        productGrid.appendChild(card);

    });
}


/* =========================
   SEARCH + FILTER
========================= */

function filterProducts() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;


    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.title
                .toLowerCase()
                .includes(searchText);


        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;


        return matchesSearch && matchesCategory;
    });


    displayProducts(filteredProducts);
}


/* =========================
   FORMAT CATEGORY
========================= */

function formatCategory(category) {

    return category
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================
   EVENT LISTENERS
========================= */

searchInput.addEventListener(
    "input",
    filterProducts
);


categoryFilter.addEventListener(
    "change",
    filterProducts
);


/* =========================
   START APPLICATION
========================= */

fetchProducts();