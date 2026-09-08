import FiltersPage from "./Pages/Filters/Filters";
import HomePage from "./Pages/Home/Home";
import ItemPage from "./Pages/Items/Item/Item";
import ListItemPage from "./Pages/Items/List/ListItem";
import LoginForm from "./Components/Dialogs/LoginForm/LoginForm";
import { AuthProvider, useAuth } from "./Contexts/AuthContext";
import { queryClient } from "./Lib/QueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

function AppLoginDialog() {
  const { loginDialogOpen, setLoginDialogOpen } = useAuth();

  return (
    <LoginForm
      open={loginDialogOpen}
      setOpen={setLoginDialogOpen}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/filters" element={<FiltersPage />} />
          <Route path="/items" element={<ListItemPage />} />
          <Route path="/item" element={<ItemPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
        </Routes>
        <AppLoginDialog />
      </AuthProvider>
    </QueryClientProvider>
  );
};