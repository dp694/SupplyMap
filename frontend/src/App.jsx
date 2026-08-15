import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SupplierDetailPage from "./pages/SupplierDetailPage.jsx";
import DependencyMapPage from "./pages/DependencyMapPage.jsx";
import AlternativeSuppliersPage from "./pages/AlternativeSuppliersPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
        <Route path="/suppliers/:id/dependencies" element={<DependencyMapPage />} />
        <Route path="/suppliers/:id/alternatives" element={<AlternativeSuppliersPage />} />
      </Route>
    </Routes>
  );
}
