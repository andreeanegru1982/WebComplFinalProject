import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Nav } from "./Navigation/Nav";
import { Homepage } from "./Homepage/Homepage";

import "./App.css";

export function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
