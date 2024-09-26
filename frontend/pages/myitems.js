import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';

const MyItems = () => {
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [onSaleProducts, setOnSaleProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const router = useRouter();


    useEffect(() => {
        const authenticatedUser = JSON.parse(localStorage.getItem('user'));
        if (!authenticatedUser) {
            router.push('/login');
            return;
        }
    
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/myItems/", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `token ${authenticatedUser.token}`,
                    },
                });
                const data = response.data;
                console.log(data);
                setPurchasedProducts(data.item_purchased);
                setSoldProducts(data.item_sold);
                setOnSaleProducts(data.item_on_sale);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
    
        fetchItems();
    }, []);

    return (
        <Layout>
            <div className="container">
                {onSaleProducts && onSaleProducts.length>0 && <><h1>Item on sale</h1>
                <div className="row">
                    <ProductList products={onSaleProducts} />
                </div></>}
                {purchasedProducts && purchasedProducts.length>0 && <> <hr className="hr" />
                <h1>Item Purchased</h1>
                <div className="row">
                    <ProductList products={purchasedProducts} />
                </div></>}
                {soldProducts && soldProducts.length>0 && <><hr className="hr" />
                <h1>Item Sold</h1>
                <div className="row">
                    <ProductList products={soldProducts} />
                </div></>}
            </div>
        </Layout>
    );
};

export default MyItems;
