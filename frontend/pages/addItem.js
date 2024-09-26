import Layout from "../components/Layout";
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from "axios";

function AddItem() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [error, setError] = useState(null);
    const router = useRouter();


    const handleSubmit = (e) => {
      const authenticatedUser = JSON.parse(localStorage.getItem('user'));
      if (!authenticatedUser) {
          router.push('/login');
          return;
      }
  
      e.preventDefault();
  
      axios.post('http://localhost:8000/api/products/create/', 
          { title, description, price }, 
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `token ${authenticatedUser.token}`,
              },
          }
      )
      .then((res) => {
          if (res.status === 201) {
              router.push('/myitems');  
          }
      })
      .catch((error) => {
          if (error.response && error.response.data) {
              setError(error.response.data.detail || "Something went wrong");
          } else {
              setError("Something went wrong");
          }
      });
  };
    
  return (
    <Layout>
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Add Item</h2>
        <form onSubmit={handleSubmit} method="post">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
          >
            Create
          </button>
        </form>
      </div>
    </Layout>
  );
  
}

export default AddItem;