import React, { useState, useEffect } from "react";
import axios from 'axios';
import './App.css';
import Cart from './Cart'

function App() {

  const [showPopup, setShowPopup] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.productid === product.productid);
  
    if (existingItem) {
      setCart(cart.map(item =>
        item.productid === product.productid
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };
    fetchProducts();
  }, []);

  if (showCart) {
    return <Cart cart={cart} setCart={setCart} onClose={() => setShowCart(false)} />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h2 className="welcome-heading">Welcome to RetailMadness!</h2>
        
        <div className="user-greeting">
          <h3>Hello Shopper!</h3>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.productid} className="product-card">
              <h4>{product.productname}</h4>
              <p>${product.price}</p>
              {product.stockquantity > 0 ? (
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
              ) : (
              <button className="sold-out-btn" disabled>
                Sold Out
              </button>
            )}
            </div>
          ))}
        </div>
        <div>
          <button className="add-to-cart-btn" onClick={() => setShowCart(true)}>
            Go to Cart
          </button>
        </div>
        

      </div>
    </div>
  );


}
export default App;