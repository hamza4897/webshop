import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Popup from '../components/Popup';
import axios from 'axios';

const ProductEditorPage = () => {
  const router = useRouter();
  const { product } = router.query;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState(null);
    const [price, setPrice] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [message, setMessage] = useState('');

    const openPopup = (msg) => {
      setMessage(msg);
      setIsPopupOpen(true);
    };

    const closePopup = () => {
      setIsPopupOpen(false);
      router.push("/") ;
    };

    useEffect(() => {
      if (product) {
          console.log(product);
  
          const fetchProductDetails = () => {
              axios.get(`http://localhost:8000/api/product/${product}/`)
                  .then((res) => {
                      const data = res.data; // axios automatically parses JSON
                      console.log(data);
                      setProductDetails(data);
                      setLoading(false);
                  })
                  .catch((error) => {
                      setError(error.message || 'Failed to fetch product details');
                      setLoading(false);
                  });
          };
  
          fetchProductDetails();
      }
  }, [product]);
    
  const handleSubmit = (e) => {
    e.preventDefault();
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));

    axios.put(`http://localhost:8000/api/products/${product}/update/`, 
        { price }, 
        {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `token ${authenticatedUser.token}`,
            },
        }
    )
    .then((res) => {
        if (res.status === 200) {
            openPopup("Product updated successfully");
        }
    })
    .catch((error) => {
        console.error("Error updating product:", error.message);
        openPopup("Failed to update product");
    });
};


    return (
      <div>
          {productDetails && (
              <Layout>
              {isPopupOpen && <Popup message={message} onClose={closePopup} />}
                  <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                      <div className="grid grid-cols-4 gap-4 border-b border-gray-300 pb-2">
                          <div className="font-semibold text-lg text-gray-800">Item</div>
                          <div className="font-semibold text-lg text-gray-800">Description</div>
                          <div className="font-semibold text-lg text-gray-800">Price</div>
                          <div className="font-semibold text-lg text-gray-800">Update Price</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 py-4" key={productDetails.id}>
                          <div className="text-gray-700">{productDetails.title}</div>
                          <div className="text-gray-700">{productDetails.description}</div>
                          <div className="text-gray-700">${productDetails.price}</div>
                          <div>
                              <form id="searchbar" className="flex" onSubmit={handleSubmit}>
                                  <input
                                      name="price"
                                      className="form-control me-2 border border-gray-300 rounded-lg p-2"
                                      type="number"
                                      placeholder="price"
                                      aria-label="Number"
                                      onChange={(e) => setPrice(e.target.value)}
                                  />
                                  <button className="btn btn-warning bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2" type="submit">
                                      Update
                                  </button>
                              </form>
                          </div>
                      </div>
                  </div>
              </Layout>
          )}
      </div>
  );
};

export default ProductEditorPage;
