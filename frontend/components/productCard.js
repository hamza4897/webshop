// components/ProductCard.js
const ProductCard = ({ product }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 duration-300">
        <img 
          src={"product.png"} 
          alt={product.title} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
          <p className="text-gray-600 mt-2">{"Seller :" + product.seller}</p>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-gray-500 mt-2 text-sm">Added on: {new Date(product.date_added).toLocaleDateString()}</p>
          <p className="text-lg font-bold text-gray-800 mt-2">
            Price: <span className="text-yellow-500">{product.price} {product.price_currency}</span>
          </p>
        </div>
      </div>
    );
  };
  
  export default ProductCard;
  