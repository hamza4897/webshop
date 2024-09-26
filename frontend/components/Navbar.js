import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Navbar = ({ user, onLogout, populateDB, cartCount }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  
 

 

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?query=${searchQuery}`);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          <span className="text-2xl font-bold cursor-pointer hover:text-yellow-500 transition-colors">webShop</span>
        </Link>
        <div className="flex items-center space-x-4">
          <form className="flex" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search"
              className="px-4 py-2 rounded-l-md border-none focus:outline-none bg-gray-800 text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-yellow-500 text-black px-4 rounded-r-md hover:bg-yellow-400 transition-colors" type="submit">
              Search
            </button>
          </form>
          <>
          <button onClick={populateDB} className="bg-yellow-500 text-black ml-4 px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors">
              Populate db
          </button>
          </>
          {user && (
            <>
              <Link href="/myitems">
                <span className="text-yellow-500 hover:text-yellow-400 transition-colors cursor-pointer">
                  My Items
                </span>
              </Link>
              <Link href="/addItem" passHref>
              <span className="bg-yellow-500 text-black ml-4 px-4 py-2 rounded-md cursor-pointer hover:bg-yellow-400 transition-colors">
                Add new item
              </span>
            </Link>
              
            </>
          )}
          <div className="relative">
            <Link href="/cart" className="bg-yellow-500 rounded-full p-2 flex items-center justify-center hover:bg-yellow-400 transition-colors">
                <img src="cart.png" alt="Cart" className="w-8 h-8 text-white cursor-pointer transition-transform transform hover:scale-110" />
            </Link>
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                {cartCount}
            </span>
          </div>
          {user ? (
            <button onClick={onLogout} className="bg-yellow-500 text-black ml-4 px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors">
              Log out
            </button>
          ) : (
            <Link href="/login" passHref>
              <span className="bg-yellow-500 text-black ml-4 px-4 py-2 rounded-md cursor-pointer hover:bg-yellow-400 transition-colors">
                Log in
              </span>
            </Link>
          )}
          {user && (
            <div className="relative">
              <button
                className="ml-4 text-yellow-500 hover:text-yellow-400 focus:outline-none"
                onClick={toggleDropdown}
              >
                <img src="user.png" alt="Cart" className="w-8 h-8 text-white cursor-pointer transition-transform transform hover:scale-110" />
              </button>
              {isOpen && (
                <div className="absolute right-0 bg-white text-black rounded-md shadow-lg mt-2 z-10">
                  <Link href="/account" passHref>
                    <span className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">Change Password</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
