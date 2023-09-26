import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import ProductsAdd from "./ProductsAdd";
import ProductsEdit from "./ProductsEdit";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Orders from "./Orders";
import PaymentVerification from "./PaymentVerification";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products_add" element={<ProductsAdd />} />
        <Route path="/products/:id" element={<ProductsEdit />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify-payment" element={<PaymentVerification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
