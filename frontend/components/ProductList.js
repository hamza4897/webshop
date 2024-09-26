import Link from 'next/link';
import Head from 'next/head';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import ProductCard from './productCard';
import { useState, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import Popup from './Popup';
import axios from 'axios';
import '../styles/main.css';

const ProductList = ({ products }) => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const { cartCount, updateCartCount } = useContext(CartContext);
  const [user, setUSer] = useState(null);
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [message, setMessage] = useState('');

  const openPopup = (msg) => {
    setMessage(msg);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));
    if (authenticatedUser) {
      const fetchUser = async () => {
        const res = await axios.get("http://localhost:8000/api/user/", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${authenticatedUser.token}`,
          },
        });
        const userDetails = res.data
        console.log(userDetails);
        setUSer(userDetails);

      };
      fetchUser();
    }

  }, [])



  const addToCart = async (productId) => {
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));
    if (!authenticatedUser) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/api/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${authenticatedUser.token}`,

        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error adding to cart:', errorData.detail || 'Unknown error');
        openPopup(errorData.detail || 'Unknown error');
        
        return;
      }
      const data = await res.json();
      setCart(data.cart.items);
      updateCartCount(data.cart.items.length);
      openPopup("product is being added to cart");
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    
    <div className="row">
    {isPopupOpen && <Popup message={message} onClose={closePopup} />}
      {products.map(product => (
        <div className="col-lg-4" key={product.id}>
          <div className="box-element product">
          <ProductCard product={product}></ProductCard>
            
            <hr/>
            <br/>
            <div className="flex justify-between items-center mt-4">
              {product.status === "on-sale" ? (
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400 transition duration-200"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>
              ) : (
                <span className="text-red-500 font-semibold">Sold Out</span>
              )}
              
              {user && user.id === product.seller && product.status === "on-sale" && (
                <Link
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400 transition duration-200"
                  href={{ pathname: '/product', query: { product: JSON.stringify(product.id) } }}
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        </div>))}
    </div>
  )
}

export default ProductList;