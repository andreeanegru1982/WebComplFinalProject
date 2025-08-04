export type Book = {
  id: number;
  title: string;
  author: string;

  year: number;
  genre: string;
  cover: string;
  userId: number;
  ratings: number[];
  reviews: Review[];
};

export type Review = {
  id: number;
  userId: number;
  user: string;
  comment: string;
  date: string;
};