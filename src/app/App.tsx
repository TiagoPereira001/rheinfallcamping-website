import { Routes, Route } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import StockPage from "./pages/StockPage";
import ContactosPage from "./pages/ContactosPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/stock/:id" element={<VehicleDetailPage />} />
          <Route path="/contactos" element={<ContactosPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}