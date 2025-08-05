import clsx from "clsx";
import { Link, useSearchParams } from "react-router-dom";

import styles from "./Books.module.css";

type PaginationProps = {
  totalCount: number;
  itemsPerPage: number;
};

export function Pagination({ totalCount, itemsPerPage }: PaginationProps) {
  const numberOfPages = Math.ceil(totalCount / itemsPerPage);
  const [params] = useSearchParams();
  const page = Number(params.get('page')) || 1;

  const jsx = [];
  let minPage = page - 1;
  let maxPage = page + 1;

  if(minPage < 1 ) minPage = 1;
  if(maxPage > numberOfPages) maxPage = numberOfPages;

  if (page > 1) {
    jsx.push(
      <Link
        key="prev"
        to={{
          search: `?page=${page - 1}`,
        }}
      >
        &laquo; Prev
      </Link>
    );
  }

  if (minPage > 1) {
    jsx.push(
      <Link
        key={1}
        to={{
          search: `?page=1`,
        }}
      >
        1
      </Link>,
      <span key="leftdots">...</span>
    );
  }

  for (let i = minPage; i <= maxPage; i++) {
    if (page !== i) {
      jsx.push(
        <Link
          key={i}
          to={{
            search: `?page=${i}`,
          }}
        >
          {i}
        </Link>
      );
    } else {
      jsx.push(<span key={i}>{i}</span>);
    }
  }

  if (maxPage < numberOfPages) {
    jsx.push(
      <span key="rightdots">...</span>,
      <Link
        key={numberOfPages}
        to={{
          search: `?page=${numberOfPages}`,
        }}
      >
        {numberOfPages}
      </Link>
    );
  }

  if (page < numberOfPages) {
    jsx.push(
      <Link
        key="next"
        to={{
          search: `?page=${page + 1}`,
        }}
      >
        Next &raquo;
      </Link>
    );
  }

  return <div className={clsx("fullWidth", styles.pagination)}>{jsx}</div>;
}
