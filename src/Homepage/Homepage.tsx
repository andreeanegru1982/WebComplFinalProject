import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../utils/types";

import styles from "./Homepage.module.css";

const apiUrl = import.meta.env.VITE_API_URL;

export function Homepage() {
  const [books, setBooks] = useState<Book[] | null>(null);

  useEffect(() => {
    async function getBooks() {
      try {
        const res = await fetch(`${apiUrl}/books`);
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
    getBooks();
  }, []);

  const topBooks = books?.filter((book) => {
    const avgRating =
      book.ratings.reduce((a, b) => a + b, 0) / book.ratings.length;
    return avgRating === 5;
  });

  function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span className={styles.rating} key={i}>
          {i <= rating ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Discover and share your favorite books</h1>
        <p>
          This is an app dedicated to book lovers. Add, edit, rate and review
          the books you love.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/books" className="btn btnWide">
            Explore
          </Link>
          <Link to="/books/add" className="btn btnWide">
            Add another book
          </Link>
        </div>
      </section>

      <section className={styles.topBooks}>
        <h2>Books rated 5 stars</h2>
        {!topBooks ? (
          <p>Loading...</p>
        ) : topBooks.length === 0 ? (
          <p>There are no books rated 5 stars yet.</p>
        ) : (
          <ul className={styles.bookList}>
            {topBooks.map((book) => {
              const avgRating = Math.round(
                book.ratings.reduce((a, b) => a + b, 0) / book.ratings.length
              );
              return (
                <li key={book.id} className={styles.bookItem}>
                  <img
                    src={book.cover}
                    alt={book.title}
                    className={styles.cover}
                  />
                  <div>
                    <strong>{book.title}</strong>{book.author}
                    <div>{renderStars(avgRating)}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
