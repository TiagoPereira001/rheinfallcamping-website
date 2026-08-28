import { Link } from "react-router";
import { WHATSAPP_NUMBER, LOCATION } from "../data/config";

const phoneDisplay = WHATSAPP_NUMBER.replace("351", "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          <div>
            <span className="text-white font-semibold text-sm block mb-4">
              RheinfallCamping
            </span>
            <p className="text-white/50 text-sm leading-relaxed">
              Compra e venda de autocaravanas usadas, preparadas por quem percebe disto.
            </p>
          </div>

          <div>
            <span className="text-white/40 text-xs font-medium uppercase tracking-wider block mb-4">
              Páginas
            </span>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">Início</Link></li>
              <li><Link to="/stock" className="text-white/60 hover:text-white text-sm transition-colors">Stock</Link></li>
              <li><Link to="/vender" className="text-white/60 hover:text-white text-sm transition-colors">Vender a minha</Link></li>
              <li><Link to="/contactos" className="text-white/60 hover:text-white text-sm transition-colors">Contactos</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-white/40 text-xs font-medium uppercase tracking-wider block mb-4">
              Contacto
            </span>
            <ul className="space-y-2.5">
              <li>
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-white/60 hover:text-white text-sm transition-colors">
                  {phoneDisplay}
                </a>
              </li>
              <li className="text-white/60 text-sm">{LOCATION}</li>
              <li className="text-white/60 text-sm">Visitas por marcação</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white/25 text-xs">
            © {new Date().getFullYear()} RheinfallCamping
          </span>
          <div className="flex items-center gap-5">
            <Link to="/termos" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              Termos e condições
            </Link>
            <Link to="/privacidade" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              Privacidade e cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;