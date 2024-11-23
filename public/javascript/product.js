async function fetchProducts() {
    try {
      const response = await fetch('/products');
      const products = await response.json();
      
      const productContainer = document.querySelector('.product-container');
      productContainer.innerHTML = '';
  
      products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
  
        productElement.innerHTML = `
          ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" />` : ''}
          <h2>${product.name}</h2>
          <div>${product.price} €</div>
          <p>${product.description}</p>
        `;
  
        productContainer.appendChild(productElement);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  }
  
document.addEventListener('DOMContentLoaded', fetchProducts);