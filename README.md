# Retail Madness

Welcome to Retail Madness! Retail Madness is an online platform that lets users browse items, add them to a cart, and experience a simulated online shopping experience.

## Features

Retail Madness offers seven items available for purchase. Each item's price and stock is displayed underneath the item's name (The stock is only there for testing purposes), and users can click the 'Add to Cart' button to add items to their cart. 

To view their selected items, users can click the 'Go to Cart' button. Inside the cart, users can see a list of the items they've added, along with the subtotal, tax, and full total. Users also have the option to clear their cart using the 'Clear Cart' button.

On the right side of the cart page, users are prompted to fill in their first and last name, email address, phone number, and payment method. After completing the form, users can click the 'Click to Buy' button. The user can not buy their item(s) if they did not fill in all of their information. The user also has to add an item to their cart in order to create an order. A confirmation message will appear, asking users to review their information. Once they confirm by clicking 'Yes,' another message will appear confirming that their purchase was successful.

**Note:** This app is a simulation. No real purchases are made through Retail Store.

## Getting the Website Working

1. First, clone this repo:
   ```bash
   git clone https://github.com/kspear1/retailStore.git
   ```

2. Once the repo is fully cloned, stay in the root folder and install dependencies:
   ```bash
   npm install
   ```

3. Navigate to the client folder and install its dependencies:
   ```bash
   cd client
   npm install
   ```

4. Then, do the same for the server folder:
   ```bash
   cd ..
   cd server
   npm install
   ```

5. Stay in the `server` directory and start the server:
   ```bash
   node server.js
   ```

6. Open a **new terminal window** and navigate to the `client` directory. Then start the website:
   ```bash
   cd ../client
   npm start
   ```

---

**NOTE:**  
I had to add a `.env` file in the `client` folder with the following contents:
```bash
WDS_SOCKET_HOST=localhost
WDS_SOCKET_PORT=0
DANGEROUSLY_DISABLE_HOST_CHECK=true
```
If this causes issues for you, you can delete the `.env` file and see if it works.  
This file was added to troubleshoot an `allowedHosts` warning in the `devServer`, but that issue may not appear on your end.
