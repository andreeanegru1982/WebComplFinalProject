import { Link, NavLink } from "react-router";
import type { MouseEvent } from "react";
import { useAuthContext } from "../Features/Auth/AuthContext";

import styles from './Nav.module.css';

export function Nav() {
  const {user, logout } = useAuthContext();

  function handleLogout (e: MouseEvent<HTMLAnchorElement>){
    e.preventDefault();
    logout();
  }
  
  return (
    <nav className={styles.siteNav}>
      <div className={styles.navContainer}>
        <h1 className={styles.logo}>
          <Link to="/">Books</Link>
        </h1>
        <menu className={styles.mainMenu}>
          <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ""}>About</NavLink></li>
        
        {!user && (
          <>
            <li className={styles.pushRight}><NavLink to="login">Login</NavLink></li>
            <li><NavLink
             to="register">Register</NavLink></li>
          </>
        )}
        {user && (
          <li className={styles.pushRight}>
            Welcome, {user.firstName}!{' '}
            <a href="/" onClick={handleLogout}>Logout</a>
          </li>
        )}
        
        </menu>
      </div>
    </nav>
  );
}




