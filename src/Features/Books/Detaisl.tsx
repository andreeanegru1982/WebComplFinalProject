import { useEffect, useState } from "react";
import type { Book } from "../../utils/types";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useAuthContext } from "../Auth/AuthContext";
import { toast } from "react-toastify";

import styles from "./Books.module.css";

const apiUrl = import.meta.env.VITE_API_URL;

Modal.setAppElement("#root");

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const { accessToken, logout } = useAuthContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    async function getBook() {
      const data = await fetch(`${apiUrl}/books/${id}`).then((res) =>
        res.json()
      );
      setBook(data);
    }

    getBook();
  }, [id]);

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleDelete() {
    await fetch(`${apiUrl}/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      if (!res.ok && res.status === 401) {
        logout();
        navigate("/login", {
          state: { from: pathname },
        });
      }
      toast.info(`"${book!.title}" has been successfully deleted! `);
      navigate(-1);
    });
  }

  if (!book) {
    return <p>Loading...</p>;
  }

  const avg = averageRating(book.ratings);

  return (
    <article className={styles.details}>
      {accessToken && (
        <div>
          <Link to="edit" className="btn">
            Edit
          </Link>
          <button
            type="button"
            className="btn"
            onClick={() => setIsModalOpen(true)}
          >
            Delete
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Example modal"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2>Delete "{book.title}"</h2>
        <p>
          Are you sure you want to delete "{book.title}"" by {book.author}? This
          action is irreversible.
        </p>
        <footer>
          <button type="button" className="btn" onClick={closeModal}>
            Cancel
          </button>
          <button type="button" className="btn" onClick={handleDelete}>
            Delete
          </button>
        </footer>
      </Modal>

      <h1>{book.title}</h1>
      <div>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>Genre:</strong> {book.genre}
        </p>
        <p>
          <strong>Year:</strong> {book.year}
        </p>
        <p>
          <strong>Rating:</strong> {renderStars(avg)}
        </p>
      </div>
      <img src={book.cover} alt={book.title} style={{ maxWidth: "300px" }} />

      <section className={styles.reviews}>
        <h2>Reviews:</h2>
        {book.reviews.length === 0 && <p>No reviews yet.</p>}
        <ul>
          {book.reviews.map((review, index) => (
            <li key={index}>
              <p>
                <strong>{review.user}:</strong> {review.comment}
              </p>
              <small>{review.date}</small>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
