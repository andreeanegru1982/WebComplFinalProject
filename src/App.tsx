import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Nav } from "./Navigation/Nav";
import { Homepage } from "./Homepage/Homepage";
import { Register } from "./Features/Auth";
import { Login } from "./Features/Auth/Login";
import { AuthContextProvider } from "./Features/Auth/AuthContext";
import { ToastContainer } from "react-toastify";
import { List } from "./Features/Books";
import { Details } from "./Features/Books/Detaisl";
import { AddBooks } from "./Features/Books/AddBooks";
import { EditBooks } from "./Features/Books/EditBooks";
import { About } from "./About/About";

import "./App.css";
import "./Forms.css"

export function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={< Register/>} />
          <Route path="books" element={< List/>} />
          <Route path="books/:id" element={< Details/>} />
          <Route path="books/:id/edit" element={< EditBooks/>} />
          <Route path="books/add" element={< AddBooks/>} />
          <Route path="about" element={< About/>} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
      <ToastContainer />
    </BrowserRouter>
    </AuthContextProvider>
    
  );
}
