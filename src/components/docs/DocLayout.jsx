import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const docNav = [
  { label: "Design Philosophy", path: "/DesignPhilosophy", section: "Protocol" },
  { label: "vs Other Standards", path: "/Comparison", section: "Protocol" },
  { label: "Protocol Spec", path: "/Docs", section: "Protocol" },
  { label: "Security Model", path: "/SecurityModel", section: "Protocol" },
  { label: "Protocol Examples", path: "/ProtocolExamples", section: "Protocol" },
  { label: "Implementations", path: "/Implementations", section: "Protocol" },
  { label: "Overview", path: "/Extensions", section: "Extensions" },
  { label: "Payments", path: "/PaymentsExtension", section: "Extensions" },
  { label: "Actions", path: "/ActionsExtension", section: "Extensions" },
  { label: "EVM Blockchains", path: "/EVMBlockchains", section: "Extensions" },
];

export default function DocLayout({ title, children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Doc header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/Home" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)} className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600">Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
          {/* Sidebar */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Protocol</p>
              {docNav.filter(item => item.section === "Protocol").map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "text-emerald-600 bg-emerald-50 font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-3">Extensions</p>
              {docNav.filter(item => item.section === "Extensions").map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "text-emerald-600 bg-emerald-50 font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile doc nav */}
          <div className="lg:hidden flex flex-wrap gap-2 -mt-4 mb-4">
            {docNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  location.pathname === item.path
                    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                    : "text-gray-500 bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Content */}
          <article className="doc-content">
            <style>{`
              .doc-content h1 {
                font-size: 2.25rem;
                font-weight: 700;
                color: #111827;
                margin-top: 4rem;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #e5e7eb;
                line-height: 1.2;
              }
              .doc-content h1:first-child {
                margin-top: 0;
              }
              .doc-content h2 {
                font-size: 1.75rem;
                font-weight: 700;
                color: #111827;
                margin-top: 3.5rem;
                margin-bottom: 1.25rem;
                line-height: 1.3;
              }
              .doc-content h3 {
                font-size: 1.375rem;
                font-weight: 600;
                color: #1f2937;
                margin-top: 2.5rem;
                margin-bottom: 1rem;
                line-height: 1.4;
              }
              .doc-content p {
                font-size: 1rem;
                color: #374151;
                line-height: 1.8;
                margin-bottom: 1.25rem;
              }
              .doc-content .lead {
                font-size: 1.25rem;
                color: #6b7280;
                line-height: 1.7;
                margin-bottom: 2rem;
              }
              .doc-content ul, .doc-content ol {
                margin: 1.5rem 0;
                padding-left: 1.5rem;
              }
              .doc-content li {
                font-size: 1rem;
                color: #374151;
                line-height: 1.8;
                margin-bottom: 0.75rem;
              }
              .doc-content strong {
                font-weight: 600;
                color: #111827;
              }
              .doc-content code {
                background: #ecfdf5;
                color: #047857;
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
                font-size: 0.9em;
                font-family: ui-monospace, monospace;
                font-weight: 500;
              }
              .doc-content pre {
                background: #030712;
                color: #d1d5db;
                padding: 1.5rem;
                border-radius: 0.75rem;
                overflow-x: auto;
                margin: 2rem 0;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                border: 1px solid #1f2937;
              }
              .doc-content pre code {
                background: transparent;
                color: inherit;
                padding: 0;
                border-radius: 0;
                font-size: 0.875rem;
              }
              .doc-content hr {
                border: 0;
                border-top: 1px solid #e5e7eb;
                margin: 3.5rem 0;
              }
              .doc-content blockquote {
                border-left: 4px solid #10b981;
                background: #ecfdf5;
                padding: 1rem 1.5rem;
                margin: 2rem 0;
                border-radius: 0 0.5rem 0.5rem 0;
                color: #1f2937;
                font-style: italic;
              }
              .doc-content a {
                color: #059669;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.2s;
              }
              .doc-content a:hover {
                color: #047857;
                text-decoration: underline;
              }
              .doc-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 2rem 0;
              }
              .doc-content th {
                background: #f9fafb;
                color: #111827;
                font-weight: 600;
                font-size: 0.875rem;
                text-align: left;
                padding: 0.75rem 1rem;
                border: 1px solid #e5e7eb;
              }
              .doc-content td {
                color: #374151;
                font-size: 0.875rem;
                padding: 0.75rem 1rem;
                border: 1px solid #f3f4f6;
              }
            `}</style>
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}