import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Github, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69860ece02a3ee62c4701f45/93c5f1c63_logo.png";

const navLinks = [
  { label: "Home", path: "/Home" },
  {
    label: "Protocol",
    children: [
      { label: "Design Philosophy", path: "/DesignPhilosophy" },
      { label: "vs Other Standards", path: "/Comparison" },
      { label: "Protocol Spec", path: "/Docs" },
      { label: "Security Model", path: "/SecurityModel" },
      { label: "Protocol Examples", path: "/ProtocolExamples" },
      { label: "Implementations", path: "/Implementations" },
    ],
  },
  {
    label: "Extensions",
    children: [
      { label: "Overview", path: "/Extensions" },
      { label: "Payments", path: "/PaymentsExtension" },
      { label: "Authorizations", path: "/AuthorizationsExtension" },
      { label: "EVM Blockchains", path: "/EVMBlockchains" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [extensionsOpen, setExtensionsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDocsOpen(false);
    setExtensionsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/10" : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/Home" className="flex items-center gap-3 group">
            <img src={LOGO_URL} alt="OpenClaiming" className="w-8 h-8 rounded-md" />
            <span className="text-white font-semibold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">
              OpenClaiming
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => {
                      if (link.label === "Protocol") {
                        setDocsOpen(!docsOpen);
                        setExtensionsOpen(false);
                      } else if (link.label === "Extensions") {
                        setExtensionsOpen(!extensionsOpen);
                        setDocsOpen(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => {
                      if (link.label === "Protocol") setDocsOpen(false);
                      if (link.label === "Extensions") setExtensionsOpen(false);
                    }, 200)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${
                      (link.label === "Protocol" && docsOpen) || (link.label === "Extensions" && extensionsOpen) ? "rotate-180" : ""
                    }`} />
                  </button>
                  <AnimatePresence>
                    {((link.label === "Protocol" && docsOpen) || (link.label === "Extensions" && extensionsOpen)) && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              location.pathname === child.path
                                ? "text-emerald-400 bg-emerald-400/5"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="https://github.com/OpenClaiming"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-950 border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-3 py-2 text-sm rounded-lg ${
                          location.pathname === child.path
                            ? "text-emerald-400 bg-emerald-400/5"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 text-sm rounded-lg ${
                      location.pathname === link.path
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <a
                href="https://github.com/OpenClaiming"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-white"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}