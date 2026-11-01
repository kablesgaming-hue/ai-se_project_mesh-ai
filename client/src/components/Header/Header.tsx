import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";

type Props = {
  onMenuOpen: () => void;
  onMenuClose: () => void;
  isMobileMenuOpen: boolean;
};

export default function Header({
  onMenuOpen,
  onMenuClose,
  isMobileMenuOpen,
}: Props) {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive ? "header__link header__link_active" : "header__link";
  }

  function handleLogout() {
    logout();
    setIsAccountMenuOpen(false);
    onMenuClose();
    navigate("/login", { replace: true });
  }

  return (
    <header className={isMobileMenuOpen ? "header header_mobile" : "header"}>
      <button
        type="button"
        className="header__menu-btn"
        aria-label="Open menu"
        onClick={onMenuOpen}
      />

      <div className="header__logo">
        <span>Mesh AI</span>
        <img src="/favicon.png" alt="Mesh AI logo" />
      </div>

      {isAuthenticated && (
        <div className="header__actions">
          <nav
            className={
              isMobileMenuOpen ? "header__nav header__nav_mobile" : "header__nav"
            }
            onClick={onMenuClose}
          >
            <NavLink to="/knowledge" className={getNavLinkClass}>
              Knowledge Base
            </NavLink>
            <NavLink to="/chat" className={getNavLinkClass}>
              Chat
            </NavLink>
          </nav>

          <div className="header__account">
            <button
              type="button"
              className="header__dropdown-btn"
              aria-haspopup="menu"
              aria-expanded={isAccountMenuOpen}
              onClick={() => setIsAccountMenuOpen((open) => !open)}
            >
              {currentUser?.name}'s Account
            </button>
            {isAccountMenuOpen && (
              <ul className="header__menu" role="menu">
                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className="header__logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
