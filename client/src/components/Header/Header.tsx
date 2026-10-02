import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive ? "header__link header__link_active" : "header__link";
  }

  return (
    <header className="header">
      <div className="header__logo">
  <span>Mesh AI</span>
  <img src="/favicon.png" alt="" />
</div>

      <nav className="header__nav">
        <NavLink to="/knowledge" className={getNavLinkClass}>
          Knowledge Base
        </NavLink>

        <NavLink to="/chat" className={getNavLinkClass}>
          Chat
        </NavLink>
      </nav>
    </header>
  );
}
