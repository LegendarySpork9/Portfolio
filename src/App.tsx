import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import ItemPage from "./Pages/Items/View/View";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/viewitem/:id" element={<ItemPage />} />
    </Routes>
  );
}