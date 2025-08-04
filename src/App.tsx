import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Nav } from "./Navigation/Nav";
import { Homepage } from "./Homepage/Homepage";
import { Register } from "./Features/Auth";
import { Login } from "./Features/Auth/Login";
import { AuthContextProvider } from "./Features/Auth/AuthContext";
import { ToastContainer } from "react-toastify";
import { List } from "./Features/Books";

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
        </Routes>
      </main>
      <ToastContainer />
    </BrowserRouter>
    </AuthContextProvider>
    
  );
}
