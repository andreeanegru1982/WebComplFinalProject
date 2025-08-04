import type { Book } from "./types";

import styles from './Books.module.css';

export function BookItem({ book }: { book: Book }) {
  return (
    <article className={styles.bookCard}>
      <img src={book.cover} alt={`${book.title} poster`} className={styles.cover} />
      <h2 className={styles.title}>{book.title}</h2>
      <p className={styles.author}>{book.author}</p>
    </article>
    
  )
}
