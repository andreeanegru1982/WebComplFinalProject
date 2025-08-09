import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Book } from "../utils/types";

import styles from "./Homepage.module.css";

const apiUrl = import.meta.env.VITE_API_URL;

export function HomepageSearch() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";

  const [books, setBooks] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState(false);

  function normalizeString(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  useEffect(() => {
    if (!query) {
      setBooks(null);
      return;
    }

    async function fetchBooks() {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/books`);
        if (!res.ok) throw new Error("Failed to fetch books");
        const data: Book[] = await res.json();

        const normalizedQuery = normalizeString(query).toLowerCase();

        const filtered = data.filter((book) => {
          const normalizedTitle = normalizeString(book.title).toLowerCase();
          const normalizedAuthor = normalizeString(book.author).toLowerCase();

          return (
            normalizedTitle.includes(normalizedQuery) ||
            normalizedAuthor.includes(normalizedQuery)
          );
        });

        setBooks(filtered);
      } catch (error) {
        console.error("Error fetching or filtering books", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [query]);

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
    <main>
      <section className={styles.searchResults}>
        <h2>Search Results</h2>

        {loading && <p>Loading...</p>}

        {!loading && books && books.length === 0 && (
          <p>No books match your search.</p>
        )}

        {!loading && books && books.length > 0 && (
          <ul className={styles.bookList}>
            {books.map((book) => {
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
                    <strong>{book.title}</strong>
                    <div>{book.author}</div>
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
