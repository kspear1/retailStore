// Import required modules
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); 

const app = express();
app.use(express.json());

//Route to handle Products
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching products:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Route to handle purchase
app.post('/api/purchase', async (req, res) => {
    const { customer, cartItems } = req.body;
  
    try {
      // Check if the customer already exists
      const { data: existingCustomer, error: findCustomerError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customer.email)
      .single(); // expect one match

      let customerData = existingCustomer;

      if (findCustomerError && findCustomerError.code !== 'PGRST116') { 
      // PGRST116 = no rows found
      throw findCustomerError; 
      }

      // If customer doesn't exist, insert them
      if (!customerData) {
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert([{
          firstname: customer.firstname,
          lastname: customer.lastname,
          email: customer.email,
          phone: customer.phone
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      customerData = newCustomer;
      }
  
      const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxRate = 0.08; // 8%
      const taxAmount = cartSubtotal * taxRate;
      const totalAmount = cartSubtotal + taxAmount;

      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([{ 
          customerid: customerData.customerid, 
          orderdate: new Date().toISOString(), 
          totalamount: totalAmount,
          paymentmethod: customer.paymentmethod
        }])
        .select()
        .single();
  
      if (orderErr) throw orderErr;
  
      for (let item of cartItems) {
        await supabase.from('order_items').insert({
          orderid: orderData.orderid,
          productid: item.productid,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        });
  
        await supabase.rpc('decrease_product_stock', {
          product_id: item.productid,
          amount: item.quantity,
        });
      }
  
      res.status(200).send('Purchase complete');
    } catch (err) {
      console.error('Error fetching products:', err.message || err);
      res.status(500).send('Error completing purchase');
    }
  });
  
  app.listen(5000, () => console.log('Server running on port 5000'));
  