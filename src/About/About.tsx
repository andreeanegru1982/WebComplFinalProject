import styles from "../Homepage/Homepage.module.css";

export function About() {
  return (
    <main>
      <div className={styles.hero}>
        <h1> About the app</h1>

        <p>
          Welcome to our community of book lovers! This app helps you track,
          rate, and review your favorite books while also discovering new gems
          recommended by others.
        </p>
      </div>
      {}
      <div className={styles.hero}>
        <p>
          Don't know what else to read? Try exploring popular titles or see what
          other users have recommended.
        </p>

        <p>
          <strong>Recommendation:</strong>
        </p>
        <div className={styles.recommendedLinks}>
          <a href="https://openlibrary.org/" target="_blank" rel="noreferrer">
            Open Library
          </a>
          <a href="https://www.goodreads.com/" target="_blank" rel="noreferrer">
            Goodreads
          </a>
        </div>
      </div>
      <footer className={styles.aboutFooter}>
        <p>
          *This app is built as a personal project and is not affiliated with
          the external services linked above.
        </p>
      </footer>
    </main>
  );
}
