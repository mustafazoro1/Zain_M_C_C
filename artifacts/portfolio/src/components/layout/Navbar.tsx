import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 mix-blend-difference text-white">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif font-bold tracking-tighter uppercase relative z-50">
          Architects.
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-widest uppercase hover:opacity-100 transition-opacity ${
                location === link.href ? "opacity-100 font-medium" : "opacity-60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden relative z-50 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            y: isMenuOpen ? 0 : -20,
            pointerEvents: isMenuOpen ? "auto" : "none",
          }}
          className="absolute top-0 left-0 w-full h-screen bg-black/95 backdrop-blur flex flex-col items-center justify-center gap-8"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`text-3xl font-serif tracking-tighter uppercase ${
                location === link.href ? "text-white" : "text-neutral-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </nav>
  );
}
