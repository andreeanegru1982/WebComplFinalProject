import { useEffect, useState } from "react";
import type { Book } from "./types";
import { BookItem } from "./Item";
import { Pagination } from "./Pagination";
import { useSearchParams } from "react-router-dom";

import styles from "./Books.module.css";

const apiUrl = import.meta.env.VITE_API_URL;
const itemsPerPage = 10;

export function List() {
  const [books, setBooks] = useState<null | Book[]>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [ params ] = useSearchParams();
  const page = Number(params.get('page'));

  useEffect(() => {
    async function getBooks() {
      const data = await fetch(
        `${apiUrl}/books?_page=${page}&limit=${itemsPerPage}`
      ).then((res) => {
        setTotalCount(Number(res.headers.get("X-Total-Count")));
        return res.json();
      });

      setBooks(data);
    }
    getBooks();
  }, [page]);

  return (
    <section className={styles.contentBox}>
      <h1 className="fullWidth">Books</h1>
      {!books && <strong>No books found!</strong>}
      {books && books.map((book) => <BookItem key={book.id} book={book} />)}
      {totalCount && (
        <Pagination itemsPerPage={itemsPerPage} totalCount={totalCount} />
      )}
    </section>
  );
}
