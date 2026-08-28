import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import StockPage from "./pages/StockPage";
import ContactosPage from "./pages/ContactosPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacidadePage from "./pages/PrivacidadePage";
import CookieBanner from "./components/CookieBanner";
import TermosPage from "./pages/TermosPage";

// Carregados só quando alguém visita estas páginas
const AdminPage = lazy(() => import("./pages/AdminPage"));
const VenderPage = lazy(() => import("./pages/VenderPage"));

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/stock/:id" element={<VehicleDetailPage />} />
            <Route path="/contactos" element={<ContactosPage />} />
            <Route path="/vender" element={<VenderPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/privacidade" element={<PrivacidadePage />} />
            <Route path="/termos" element={<TermosPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}