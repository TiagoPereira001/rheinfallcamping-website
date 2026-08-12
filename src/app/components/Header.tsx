import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NavLink } from "react-router";
import { navLinks } from "../data/vehicles";
import { WHATSAPP_NUMBER } from "../data/config";

const phoneDisplay = WHATSAPP_NUMBER.replace("351", "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-black/8 sticky top-0 z-50 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-4">
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="text-[1.1rem] sm:text-[1.25rem] font-semibold text-black tracking-tight select-none hover:opacity-70 transition-opacity truncate"
        >
          RheinfallCamping
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `text-[0.8125rem] tracking-wide transition-opacity duration-200 ${
                    isActive ? "text-black font-medium" : "text-black/60 hover:text-black"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="flex items-center gap-2 text-black/60 hover:text-black text-sm transition-colors"
          >
            <Phone size={14} />
            <span>{phoneDisplay}</span>
          </a>
        </div>

        <button
          className="md:hidden text-black p-1 -mr-1 hover:opacity-50 transition-opacity"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-black/8 px-6 py-5 absolute w-full shadow-lg">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-black text-sm tracking-wide block w-full text-left"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2 text-black/70 text-sm"
              >
                <Phone size={14} />
                <span>{phoneDisplay}</span>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;