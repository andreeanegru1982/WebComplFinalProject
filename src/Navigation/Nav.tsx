import { Link, NavLink } from "react-router";

import styles from './Nav.module.css';

export function Nav() {
  return (
    <nav className={styles.siteNav}>
      <div className={styles.navContainer}>
        <h1 className={styles.logo}>
          <Link to="/">Books</Link>
        </h1>
        <ul className={styles.mainMenu}>
          <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ""}>Fun fact</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}




