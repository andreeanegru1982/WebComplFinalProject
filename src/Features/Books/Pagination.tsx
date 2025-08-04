import clsx from "clsx";
import { Link } from "react-router-dom";

import styles from './Books.module.css'

type PaginationProps = {
    totalCount: number;
    itemsPerPage: number;
}


export function Pagination({totalCount, itemsPerPage}: PaginationProps) {
  const numberOfPages = Math.ceil(totalCount / itemsPerPage);

  const jsx = [];

  for(let i = 1; i <= numberOfPages; i++ ) {
    jsx.push(<Link key={i} to={{
        search:`?page=${i}`
    }}>{i}</Link>)
  }

  return (
    <div className={clsx('fullWidth', styles.pagination )}>{jsx}</div>
  )
}
