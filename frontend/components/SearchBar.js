// components/SearchBar.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?query=${searchQuery}`);
  };

  return (
    <form id="searchbar" className="d-flex" onSubmit={handleSearch}>
      <input
        name="search"
        className="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="btn btn-warning" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
