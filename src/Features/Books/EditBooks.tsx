import { z } from "zod/v4";
import { validateForm, type ValidationErrors } from "../../utils/validations";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuthContext } from "../Auth/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import type { Book } from "../../utils/types";

const apiUrl = import.meta.env.VITE_API_URL;

const validationSchema = z.object({
  title: z.string().min(1, "Title is required."),
  author: z.string().min(1, "Author is required."),
  year: z.coerce
    .number("Please specify a valid release year.")
    .int("Please specify a valid release year.")
    .min(1000, "Please specify a valid release year.")
    .max(9999, "Please specify a valid release year."),
  genre: z.string().min(1, "Genre is required."),
  cover: z.url("Please enter a valid URL for the book's cover."),
  rating: z.coerce
    .number("Please select rating")
    .min(1, "Please select rating")
    .max(5, "Please select rating"),
  review: z.string().optional(),
});

const initialDefaultValues = {
  title: "",
  author: "",
  year: "",
  genre: "",
  cover: "",
  rating: "",
  review: "",
};

export function EditBooks() {
  const [book, setBook] = useState<null | Book>(null);
  const [errors, setErrors] = useState<null | ValidationErrors<
    typeof validationSchema
  >>(null);
  const [defaultValues, setDefaultValues] = useState(initialDefaultValues);

  const { user, accessToken } = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!user) return;

    fetch(`${apiUrl}/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);

        const currentUserReview = Array.isArray(data.reviews)
          ? data.reviews.find((r: any) => r.userId === user.id)
          : null;

        setDefaultValues({
          title: data.title || "",
          author: data.author || "",
          year: String(data.year) || "",
          genre: data.genre || "",
          cover: data.cover || "",
          rating:
            String(
              Array.isArray(data.ratings) ? data.ratings[0] : data.rating || ""
            ) || "",
          review: currentUserReview ? currentUserReview.comment : "",
        });
      });
  }, [id, user]);

  function closePage() {
    navigate(-1);
  }

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setDefaultValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (!errors) return;

    const form = e.currentTarget.form;
    if (!form) return;

    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const newErrors = validateForm(values, validationSchema);

    setErrors(newErrors);
  }

  async function handleUpdateBook(formData: FormData) {
    const rawValues: Record<string, FormDataEntryValue | FormDataEntryValue[]> =
      Object.fromEntries(formData.entries());

    const errors = validateForm(rawValues, validationSchema);

    if (errors) {
      setErrors(errors);
      setDefaultValues(rawValues as typeof defaultValues);
      return;
    }
    setErrors(null);
    setDefaultValues(initialDefaultValues);

    const rawReview = rawValues.review ? String(rawValues.review).trim() : "";
    let updatedReviews = [...book!.reviews];

    const existingReviewIndex = updatedReviews.findIndex(
      (r) => r.userId === user!.id
    );
    const existingReview =
      existingReviewIndex !== -1 ? updatedReviews[existingReviewIndex] : null;

    if (rawReview === "" && existingReview) {
      updatedReviews.splice(existingReviewIndex, 1);
    } else if (rawReview && rawReview !== existingReview?.comment) {
      const newReview = {
        id: existingReview?.id || updatedReviews.length + 1,
        userId: user!.id,
        user: user!.firstName,
        comment: rawReview,
        date: new Date().toISOString().slice(0, 10),
      };

      if (existingReviewIndex !== -1) {
        updatedReviews[existingReviewIndex] = newReview;
      } else {
        updatedReviews.push(newReview);
      }
    }

    const newBookData = {
      title: String(rawValues.title),
      author: String(rawValues.author),
      year: Number(rawValues.year),
      genre: String(rawValues.genre),
      cover: String(rawValues.cover),
      userId: Number(user!.id),
      ratings: [Number(rawValues.rating)],
      reviews: updatedReviews,
    };

    await fetch(`${apiUrl}/books/${id}`, {
      method: "PATCH",
      body: JSON.stringify(newBookData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    toast.success(
      `You have successfully updated the book: "${newBookData.title}" by "${newBookData.author}"`
    );
    navigate(`/books/${id}`);
  }

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <form
      className="brandForm"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleUpdateBook(formData);
      }}
    >
      <h1 className="fullWidth">Edit "{book.title}"</h1>

      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        name="title"
        defaultValue={defaultValues.title}
        onChange={handleInputChange}
      />
      {errors?.title && <p className="fieldError">{errors.title[0]}</p>}

      <label htmlFor="author">Author</label>
      <input
        type="text"
        id="author"
        name="author"
        defaultValue={defaultValues.author}
        onChange={handleInputChange}
      />
      {errors?.author && <p className="fieldError">{errors.author[0]}</p>}

      <label htmlFor="year">Year</label>
      <input
        type="text"
        id="year"
        name="year"
        inputMode="numeric"
        defaultValue={defaultValues.year}
        onChange={handleInputChange}
      />
      {errors?.year && <p className="fieldError">{errors.year[0]}</p>}

      <label htmlFor="genre">Genre</label>
      <input
        type="text"
        id="genre"
        name="genre"
        defaultValue={defaultValues.genre}
        onChange={handleInputChange}
      />
      {errors?.genre && <p className="fieldError">{errors.genre[0]}</p>}

      <label htmlFor="cover">Cover</label>
      <input
        type="url"
        id="cover"
        name="cover"
        defaultValue={defaultValues.cover}
        onChange={handleInputChange}
      />
      {errors?.cover && <p className="fieldError">{errors.cover[0]}</p>}

      <span className="label alignTop">Rating</span>
      <fieldset>
        <legend>Select rating</legend>
        {[1, 2, 3, 4, 5].map((num) => (
          <label htmlFor="rating" key={num}>
            {num}
            <input
              type="radio"
              name="rating"
              value={num}
              defaultChecked={defaultValues.rating === String(num)}
              onChange={handleInputChange}
            />
          </label>
        ))}
        {errors?.rating && <p className="fieldError">{errors.rating[0]}</p>}
      </fieldset>

      <label htmlFor="review">Review</label>
      <div className="reviewGroup">
        <textarea
          id="review"
          name="review"
          value={defaultValues.review}
          onChange={handleInputChange}
        />
        {defaultValues.review && (
          <button
            type="button"
            onClick={() => {
              if (!book) return;
              const filteredReviews = book.reviews.filter(
                (r) => r.userId !== user!.id
              );
              setBook({ ...book, reviews: filteredReviews });
              setDefaultValues({ ...defaultValues, review: "" });
            }}
            className="btn btnCenter btnWide"
          >
            Delete Review
          </button>
        )}
      </div>
      <div className="btnRow">
        <button
          type="button"
          className="btn btnCenter btnWide"
          onClick={closePage}
        >
          Cancel
        </button>

        <button type="submit" className="btn btnCenter btnWide">
          Update book
        </button>
      </div>
    </form>
  );
}
