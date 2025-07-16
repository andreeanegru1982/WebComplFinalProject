import { useEffect, useState } from "react";
import type { Book } from "./types";

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
        </span> // ★ = stea plină, ☆ = stea goală
      );
    }
    return stars;
  }

  return (
    <main className={styles.main}>
      <h1>Welcome to the Books site!</h1>
      <h2>Bookes rated 5 stars</h2>

      {!topBooks ? (
        <p>Loading books...</p>
      ) : topBooks.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <ul className={styles.bookList}>
          {topBooks.map((book) => {
            const avgRating = Math.round(
              book.ratings.reduce((a, b) => a + b, 0) / book.ratings.length
            );
            return (
              <li key={book.id} className={styles.bookItem}>
                <strong>{book.title}</strong> by {book.author}{" "}
                {renderStars(avgRating)}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
