import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./Lib/QueryClient";
import { AuthProvider } from "./Contexts/AuthContext";
import Home from "./Pages/Home/Home";
import FiltersPage from "./Pages/Filters/Filters";
import ItemPage from "./Pages/Items/View/View";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filters" element={<FiltersPage />} />
          <Route path="/viewitem/:id" element={<ItemPage />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}