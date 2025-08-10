import { z } from "zod";
import { useAuthContext } from "./AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

// Schema de validare
const validationSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  firstName: z.string().min(1, "Please tell us your first name."),
  lastName: z.string().min(1, "Please tell us your last name."),
});

type ValidationErrors<T> = Partial<Record<keyof T, string[]>>;

export function ProfileEdit() {
  const { user, accessToken, login } = useAuthContext();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<ValidationErrors<
    z.infer<typeof validationSchema>
  > | null>(null);
  const [defaultValues, setDefaultValues] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  function closeProfile() {
    navigate("/");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDefaultValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) =>
      prev ? { ...prev, [e.target.name]: undefined } : null
    );
  }

  async function handleProfileUpdate(formData: FormData) {
    if (!accessToken) {
      toast.error("You are not authenticated!");
      return;
    }

    const values = Object.fromEntries(formData.entries());

    const validation = validationSchema.safeParse(values);
    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }
    setErrors(null);

    const res = await fetch(`${apiUrl}/users/${user?.id}`, {
      method: "PATCH",
      body: JSON.stringify(validation.data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      toast.error("Profile update has failed!");
      return;
    }

    const updatedUser = await res.json();

    login({
      accessToken,
      user: updatedUser,
    });
    toast.success("Profile updated successfully!");

    navigate("/");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleProfileUpdate(formData);
  }

  return (
    <div className="formWrapper">
      <form onSubmit={onSubmit} className="brandForm" noValidate>
        <h1 className="fullWidth">Edit Profile</h1>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={defaultValues.email}
          onChange={handleInputChange}
        />
        {errors?.email && <p className="fieldError">{errors.email[0]}</p>}

        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={defaultValues.firstName}
          onChange={handleInputChange}
        />
        {errors?.firstName && (
          <p className="fieldError">{errors.firstName[0]}</p>
        )}

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={defaultValues.lastName}
          onChange={handleInputChange}
        />
        {errors?.lastName && <p className="fieldError">{errors.lastName[0]}</p>}

        <div className="btnRow">
          <button
            type="button"
            className="btn btnCenter btnWide"
            onClick={closeProfile}>
            Cancel
          </button>

          <button type="submit" className="btn btnCenter btnWide">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
