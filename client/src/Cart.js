import React, { useState } from 'react';
import './App.css';
import App from './App'

const Cart = ({ cart = [], setCart, onClose, fetchProducts }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    paymentmethod: ''
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.08; // 8%
  const taxAmount = cartSubtotal * taxRate;
  const totalWithTax = cartSubtotal + taxAmount;
  const [formError, setFormError] = useState(''); 


  console.log('Cart received:', cart);console.log('Cart received:', cart);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePurchase = async () => {
    //Forces user to fill in all inputs
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone || !formData.paymentmethod) {
      setFormError('⚠️ Please fill out all required fields before purchasing.');
      return;
    }
  
    //Clears any previous errors
    setFormError('');

    if (!window.confirm('Is everything correct?')) return;

    console.log('Sending to server:', formData, cart);
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: formData, cartItems: cart })
      });

      if (response.ok) {
        alert('Purchase Successful');
        setCart([]);
        setFormData({ firstname: '', lastname: '', email: '', phone: '' });
        fetchProducts(); //Immediately updates the stock on the frontend
      } else {
        alert('Error: Purchase failed');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      alert('An error occurred');
    }
  };


  return (
    <div className="cart-container">
      <div className="cart-left">
        <h3>Your Cart</h3>
        {cart.map((item, index) => (
          <p key={index}>
            {item.quantity}x {item.productname} - ${(
              item.price * item.quantity
            ).toFixed(2)}
          </p>
        ))}

        <hr className="cart-divider" />

        <div className="cart-summary">
        <p><strong>Subtotal:</strong> ${cartSubtotal.toFixed(2)}</p>
        <p><strong>Tax (8%):</strong> ${taxAmount.toFixed(2)}</p>
        <p><strong>Total:</strong> ${totalWithTax.toFixed(2)}</p>
        <button className="clear-cart-btn" onClick={() => setCart([])}>
          Clear Cart
        </button>
      </div>
      </div>

      <div className="cart-right">
        <h3>Customer Info</h3>
        <div className="input-form">
          <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} />
          <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          <select 
          name="paymentmethod" 
          value={formData.paymentmethod} 
          onChange={handleChange} 
          className="payment-method-select"
          >
          <option value="">Payment Method</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
          <option value="PayPal">Paypal</option>
        </select>
        </div>
        <button onClick={handlePurchase}>Click to Buy</button>
        </div>
        {formError && (
          <div className="form-error-message">
            {formError}
          </div>
        )}
      <div>
      <button className="add-to-cart-btn" onClick={onClose}>
        Continue Shopping!
      </button>
      </div>
    </div>
  );
};

export default Cart;