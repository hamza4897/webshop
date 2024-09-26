// components/DropdownMenu.js
import Link from 'next/link';
import { useState } from 'react';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const hideDropdown = () => {
    setIsOpen(false);
  };

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" onClick={toggleDropdown}>
        Edit
      </a>
      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <Link className="dropdown-item" href="/changePassword">Change Password</Link>
        <a className="dropdown-item" href="#">Add more feature</a>
      </div>
      {isOpen && (
        <button type="button" className="modal-backdrop opacity-0" style={{ zIndex: 999, cursor: 'auto' }} onClick={hideDropdown}>
          Hide dropdown
        </button>
      )}
    </li>
  );
};

export default DropdownMenu;
