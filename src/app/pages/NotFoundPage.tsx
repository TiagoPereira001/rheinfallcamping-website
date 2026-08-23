import { Link } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";

function NotFoundPage() {
  usePageTitle("Página não encontrada");

  return (
    <div className="bg-[#f4f4f2] min-h-[70vh] flex items-center justify-center py-24">
      <div className="max-w-md mx-auto px-6 text-center">
        <span className="block text-black/25 text-6xl font-medium mb-6">404</span>
        <h1 className="text-black text-2xl font-medium mb-4">
          Não encontrámos esta página
        </h1>
        <p className="text-black/65 text-[0.9375rem] leading-relaxed mb-8">
          O link pode estar errado, ou a autocaravana que procurava já não está disponível.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/stock"
            className="bg-black text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-black/85 transition-colors"
          >
            Ver o stock
          </Link>
          <Link
            to="/"
            className="border border-black/15 text-black text-sm font-medium px-6 py-3 rounded-xl hover:bg-black/5 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;