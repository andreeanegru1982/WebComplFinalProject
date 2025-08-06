import { z } from "zod/v4";
import { validateForm, type ValidationErrors } from "../../utils/validations";
import { useState } from "react";

const validationSchema = z.object({
  title: z.string().min(1, "Title is required."),
  author: z.string().min(1, "Author is required."),
  year: z.coerce.number("Please specify a valid release year.").int("Please specify a valid release year.").min(1000, "Please specify a valid release year.").max(9999, "Please specify a valid release year."),
  genre: z.string().min(1, "Genre is required."),
  cover: z.url("Please enter a valid URL for the book's cover."),
  rating: z.coerce.number("Please select rating").min(1, "Please select rating").max(5, "Please select rating"),
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

  async function handleAddBook(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const errors = validateForm(values, validationSchema);

    console.log(values);

    if (errors) {
      setErrors(errors);
      setDefaultValues(values as typeof defaultValues);
      return;
    }
    setErrors(null);
    setDefaultValues(initialDefaultValues);
  }
  return (
    <form className="brandForm" action={handleAddBook}>
      <h1 className="fullWidth">Add Books</h1>

      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" defaultValue={defaultValues.title}/>
      {errors?.title && <p className="fieldError">{errors.title[0]}</p>}

      <label htmlFor="author">Author</label>
      <input type="text" id="author" name="author" defaultValue={defaultValues.author}/>
      {errors?.author && <p className="fieldError">{errors.author[0]}</p>}

      <label htmlFor="year">Year</label>
      <input type="text" id="year" name="year" inputMode="numeric" defaultValue={defaultValues.year}/>
      {errors?.year && <p className="fieldError">{errors.year[0]}</p>}

      <label htmlFor="genre">Genre</label>
      <input type="text" id="genre" name="genre" defaultValue={defaultValues.genre}/>
      {errors?.genre && <p className="fieldError">{errors.genre[0]}</p>}

      <label htmlFor="cover">Cover</label>
      <input type="url" id="cover" name="cover" defaultValue={defaultValues.cover}/>
      {errors?.cover && <p className="fieldError">{errors.cover[0]}</p>}

      <span className="label alignTop">Rating</span>
      <fieldset>
        <legend>Select rating</legend>
        {[1, 2, 3, 4, 5].map((num) => (
          <label htmlFor="rating" key={num}>
            {num}
            <input type="radio" name="rating" value={num} defaultChecked={defaultValues.rating === String(num)}/>
            
          </label>
        ))}
        {errors?.rating&& <p className="fieldError">{errors.rating[0]}</p>}
      </fieldset>
      <label htmlFor="review">Review</label>
      <textarea id="review" name="review" defaultValue={defaultValues.review}/>

      <button type="submit" className="btn btnFormAction btnCenter">
        Add book
      </button>
    </form>
  );
}
