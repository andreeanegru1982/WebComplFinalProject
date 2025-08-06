import { useEffect, useState } from "react";
import type { Book } from "./types";
import { BookItem } from "./Item";
import { Pagination } from "./Pagination";
import { Link, Links, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { HiPlusCircle } from "react-icons/hi2";
import { useAuthContext } from "../Auth/AuthContext";

import styles from "./Books.module.css";

const apiUrl = import.meta.env.VITE_API_URL;
const itemsPerPage = 10;

export function List() {
  const [books, setBooks] = useState<null | Book[]>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [params] = useSearchParams();
  const page = Number(params.get("page"));
  const { accessToken } = useAuthContext();

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

  function handleAddBook() {}

  return (
    <section className={styles.contentBox}>
      <h1 className="fullWidth">Books</h1>
      {!books && <strong>No books found!</strong>}
      {books && books.map((book) => <BookItem key={book.id} book={book} />)}
      {totalCount && (
        <Pagination itemsPerPage={itemsPerPage} totalCount={totalCount} />
      )}
      {books && accessToken && (
        <Link to="add" className={clsx(styles.addBookBtn)}>
          <HiPlusCircle />
        </Link>
      )}
    </section>
  );
}
