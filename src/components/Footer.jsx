import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69860ece02a3ee62c4701f45/93c5f1c63_logo.png";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="OpenClaiming" className="w-7 h-7 rounded-md" />
              <span className="text-white font-semibold text-lg">OpenClaiming</span>
            </div>
            <p className="text-sm leading-relaxed">
              An open protocol for publishing and verifying cryptographically signed claims.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Protocol</h4>
            <div className="space-y-2.5">
              <Link to="/Docs" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">Documentation</Link>
              <Link to="/SecurityModel" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">Security Model</Link>
              <Link to="/ProtocolExamples" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">Examples</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Extensions</h4>
            <div className="space-y-2.5">
              <Link to="/Extensions" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">Overview</Link>
              <Link to="/PaymentsExtension" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">Payments</Link>
              <Link to="/AuthorizationsExtension" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">Authorizations</Link>
              <Link to="/EVMBlockchains" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">EVM Blockchains</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Design</h4>
            <div className="space-y-2.5">
              <Link to="/DesignPhilosophy" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">Philosophy</Link>
              <Link to="/Implementations" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">Implementations</Link>
              <Link to="/Comparison" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="block text-sm hover:text-white transition-colors">vs Other Standards</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Community</h4>
            <div className="space-y-2.5">
              <a href="https://github.com/OpenClaiming" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-600">
          Released under a permissive open source license.
        </div>
      </div>
    </footer>
  );
}