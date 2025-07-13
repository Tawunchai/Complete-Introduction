import React from "react";
import "./navbar.css";
import Logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="nav-root">
      {/* Logo */}
      <div className="nav-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        <img src={Logo} alt="Logo" />
        <span>Mason</span>
      </div>
      {/* Menu */}
      <ul className="nav-menu">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/admin")}>Admin</li>
      </ul>
      {/* Cart + Log In */}
      <div className="nav-right">
        <button className="nav-cart-btn">
          <svg width="22" height="22" fill="none" stroke="#444" strokeWidth="1.6" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1.2" />
            <circle cx="20" cy="21" r="1.2" />
            <path d="M1.9 2h2.3l2.1 13h12.2l2.3-8.7H6.2" />
          </svg>
        </button>
        <button className="nav-login-btn">Log In</button>
      </div>
    </nav>
  );
};

export default Navbar;
