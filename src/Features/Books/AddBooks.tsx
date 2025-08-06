import { z } from "zod/v4";
import { validateForm, type ValidationErrors } from "../../utils/validations";
import { useState } from "react";
import { useAuthContext } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

export function AddBooks() {
  
  const [errors, setErrors] = useState<null | ValidationErrors<
    typeof validationSchema
  >>(null);
  const [defaultValues, setDefaultValues] = useState(initialDefaultValues);

  const { user, accessToken } = useAuthContext();
  const navigate = useNavigate();

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    if (!errors) return;

    const form = e.currentTarget.form;
    if (!form) return;

    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const newErrors = validateForm(values, validationSchema);

    setErrors(newErrors);
  }

  async function handleAddBook(formData: FormData) {
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

   const newReview = rawValues.review
  ? [{
      id: 1, // sau uuid
      userId: user!.id,
      user: user!.firstName,
      comment: String(rawValues.review),
      date: new Date().toISOString().slice(0, 10),
    }]
  : [];


    const newBookData = {
      title: String(rawValues.title),
      author: String(rawValues.author),
      year: Number(rawValues.year),
      genre: String(rawValues.genre),
      cover: String(rawValues.cover),
      userId: Number(user!.id),
      ratings: [Number(rawValues.rating)],
      reviews: newReview,
    };

    await fetch(`${apiUrl}/books`, {
      method: "POST",
      body: JSON.stringify(newBookData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    toast.success(
      `You have successfully added a new book: "${newBookData.title}" by "${newBookData.author}"`
    );
    navigate("/books");
  }
  return (
    <form
      className="brandForm"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleAddBook(formData);
      }}
    >
      <h1 className="fullWidth">Add Books</h1>

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
      <textarea
        id="review"
        name="review"
        defaultValue={defaultValues.review}
        onChange={handleInputChange}
      />

      <button type="submit" className="btn btnCenter btnWide">
        Add book
      </button>
    </form>
  );
}
