import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./Lib/QueryClient";
import Home from "./Pages/Home/Home";
import ItemPage from "./Pages/Items/View/View";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/viewitem/:id" element={<ItemPage />} />
      </Routes>
    </QueryClientProvider>
  );
}