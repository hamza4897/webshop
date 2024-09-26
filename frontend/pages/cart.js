import Layout from "../components/Layout";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { CartContext } from "../contexts/CartContext";
import Link from "next/link";
import axios from "axios";
import Popup from "../components/Popup";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [priceChanges, setPriceChanges] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [checkoutError, setCheckoutError] = useState(null);
  const { cartCount, updateCartCount } = useContext(CartContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const openPopup = (msg) => {
    setMessage(msg);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const authenticatedUser = JSON.parse(localStorage.getItem("user"));
    const fetchCartItems = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/cart/", {
          headers: {
            Authorization: `token ${authenticatedUser.token}`,
          },
        });

        setCartItems(data.items || []);
        updateCartCount(data.items.length || 0);
        setCartTotal(
          data.items.reduce((sum, item) => sum + Number(item.product.price), 0)
        );
      } catch (error) {
        setError("Failed to fetch cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [updateCartCount]);

  const removeCartItem = async (productId) => {
    const authenticatedUser = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.post(
        "http://localhost:8000/api/cart/remove/",
        { product_id: productId },
        {
          headers: {
            Authorization: `token ${authenticatedUser.token}`,
          },
        }
      );

      const updatedCartItems = cartItems.filter(
        (item) => item.product.id !== productId
      );
      setCartItems(updatedCartItems);
      updateCartCount(updatedCartItems.length);
      setCartTotal(updatedCartItems.reduce((sum, item) => sum + Number(item.product.price), 0));
      openPopup("Item removed");
    } catch (error) {
      setError("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    const authenticatedUser = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.post(
        "http://localhost:8000/api/checkout/",
        {},
        {
          headers: {
            Authorization: `token ${authenticatedUser.token}`,
          },
        }
      );

      if (res.status === 400) {
        const data = res.data;
        setPriceChanges(data.price_changes || []);
        setSoldItems(data.unavailable_items || []);
        setCheckoutError(
          "Some items have price changes or are unavailable. Please review your cart."
        );
      } else {
        openPopup("Items purchased successfully!");
        setCartItems([]);
        updateCartCount(0);
        setCartTotal(0);
      }
    } catch (error) {
      setError("Checkout failed. Please try again.");
    }
  };

  const hasPriceChanged = (productId) =>
    priceChanges.some((item) => item.id === productId);

  const isSoldOut = (productId) =>
    soldItems.some((item) => item.id === productId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
            <div className="row">
            {isPopupOpen && <Popup message={message} onClose={closePopup} />}
                <div className="col-lg-12">
                    <div className="box-element">

                        <Link className="text-gray-600 hover:text-gray-800 transition duration-200" href="/">&#x2190; Continue Shopping</Link>

                        <br />
                        <br />
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-600">
                                        <h5>
                                            Items: <strong>{cartCount}</strong>
                                        </h5>
                                    </th>
                                    <th className="px-4 py-2 text-left text-gray-600">
                                        <h5>
                                            Total:<strong> ${cartTotal}</strong>
                                        </h5>
                                    </th>
                                    <th>
                                        <div>
                                            <button className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition duration-200" style={{ float: 'right', margin: '5px' }} onClick={() => handleCheckout()}>
                                                Checkout
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>

                    </div>

                    <br />
                    <div className="box-element">
                        <div className="cart-row">
                            <div style={{ flex: 1 }}><strong>Title</strong></div>
                            <div style={{ flex: 2 }}><strong>Description</strong></div>
                            <div style={{ flex: 2 }}><strong>Price</strong></div>
                            <div style={{ flex: 1 }}><strong>Remove Item</strong></div>
                        </div>
                        {cartItems && cartItems.length > 0 && cartItems.map((item) => (
                            <div className="cart-row" key={item.product.id}>
                                <div style={{ flex: 1 }}><p className="text-gray-800">{item.product.title}</p></div>
                                <div style={{ flex: 2 }}><p className="text-gray-800">{item.product.title}</p></div>
                                <div style={{ flex: 2 }}><p className="text-gray-800">{item.product.price}</p>
                                    {hasPriceChanged(item.product.id) && (<p className="text-warning">Price has changed!</p>)}
                                    {isSoldOut(item.product.id) && (<p className="text-warning">Product not available!</p>)}

                                </div>
                                <div style={{ flex: 1 }} > <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition duration-200" onClick={() => removeCartItem(item.product.id)}>
                                    Remove
                                </button></div>
                            </div>))}

                    </div>
                </div>
            </div>
        </Layout>
  );
}

export default Cart;
