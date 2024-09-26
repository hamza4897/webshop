import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import React, { useEffect, useState } from 'react';

export default function Home({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/products');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!initialProducts) {
      fetchProducts();
    }
  }, [initialProducts]);

  if (loading) return <p className="text-center mt-4">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Products</h1>
        <ProductList products={products} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:8000/api/products');
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await res.json();
    return {
      props: {
        initialProducts: products,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialProducts: [],
      },
    };
  }
}
