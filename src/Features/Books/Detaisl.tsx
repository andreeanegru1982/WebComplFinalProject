import { useEffect, useState } from "react";
import type { Book } from "./types";
import { useParams } from "react-router-dom";

import styles from './Books.module.css'

const apiUrl = import.meta.env.VITE_API_URL;

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

function averageRating(ratings: number[]) {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return Math.round(sum / ratings.length);
}

export function Details() {
  const [book, setBook] = useState<null | Book>(null);
  const { id } = useParams();

  useEffect(() => {
    async function getBook() {
      const data = await fetch(`${apiUrl}/books/${id}`).then((res) => res.json());
      setBook(data);
    }

    getBook();
  }, [id]);

  if(!book) {
    return <p>Loading...</p>;
  }
  
  const avg = averageRating(book.ratings);

  return (
    <article className={styles.details}>
      <h1>{book.title}</h1>
      <div>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Year:</strong> {book.year}</p>
        <p><strong>Rating:</strong> {renderStars(avg)}</p>
      </div>
      <img src={book.cover} alt={book.title} style={{ maxWidth: "300px" }} />
    
      <section className={styles.reviews}>
        <h2>Reviews:</h2>
        {book.reviews.length === 0 && <p>No reviews yet.</p>}
        <ul>
          {book.reviews.map((review) => (
            <li key={review.id}>
              <p><strong>{review.user}:</strong> {review.comment}</p>
              <small>{review.date}</small>
            </li>
          ))}
        </ul>
      </section>
    
    </article>
  );
}
