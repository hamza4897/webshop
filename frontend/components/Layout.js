import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '../contexts/CartContext';
import Navbar from './Navbar';
import '../styles/main.css';
import axios from 'axios';
import Popup from './Popup';

const Layout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const {cartCount, resetCartCount } = useContext(CartContext);
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
    setUser(authenticatedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    resetCartCount();
    router.push('/login');
    
  };

  const populateDB = async (e) => {
    e.preventDefault();
   
    await axios.post("http://localhost:8000/api/populate-db/", {}, {
      headers: { 'Content-Type': 'application/json' }
    }).then(function (response) {
      // handle success
      const message = response.data;
      handleLogout();
      openPopup(message.message);
      console.log('Response:', response.data);
    })
    .catch(function (error) {
      // handle error
      console.error('Error:', error);
    });
    
    
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} populateDB={populateDB}  cartCount={cartCount}/>
      {isPopupOpen && <Popup message={message} onClose={closePopup} />}
      <div className="container mt-4">
        
        {children}
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossOrigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
};

export default Layout;
