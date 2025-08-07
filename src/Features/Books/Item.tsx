import type { Book } from "../../utils/types";

import styles from './Books.module.css';
import { Link } from "react-router-dom";

export function BookItem({ book }: { book: Book }) {
  return (
    <article className={styles.bookCard}>
      <Link to={String(book.id)} >
        <img src={book.cover} alt={`${book.title} poster`} className={styles.cover} />
        <h2 className={styles.title}>{book.title}</h2>
        <p className={styles.author}>{book.author}</p>
      </Link>
    </article>
    
  )
}
