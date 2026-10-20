import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import HomePage from "./features/home/HomePage";
import DiscoverPage from "./features/discover/DiscoverPage";
import SeriesPage from "./features/series/SeriesPage";
import SavedPage from "./features/saved/SavedPage";
import ProfilePage from "./features/profile/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="jelajahi" element={<DiscoverPage />} />
        <Route path="serial" element={<SeriesPage />} />
        <Route path="tersimpan" element={<SavedPage />} />
        <Route path="profil" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
