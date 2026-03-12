import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const docNav = [
  { label: "Protocol Spec", path: "/Docs" },
  { label: "Security Model", path: "/SecurityModel" },
  { label: "Protocol Examples", path: "/ProtocolExamples" },
  { label: "Design Philosophy", path: "/DesignPhilosophy" },
  { label: "vs Other Standards", path: "/Comparison" },
];

export default function DocLayout({ title, children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Doc header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/Home" className="hover:text-gray-600 transition-colors">Home</Link>
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
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Documentation</p>
              {docNav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
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
          <div className="prose prose-gray prose-lg max-w-none
            prose-headings:tracking-tight prose-headings:text-gray-900
            prose-h1:text-2xl prose-h1:font-bold prose-h1:mt-12 prose-h1:mb-4 prose-h1:first:mt-0
            prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-3
            prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-2
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-li:text-gray-600
            prose-strong:text-gray-900
            prose-code:text-emerald-600 prose-code:bg-emerald-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-950 prose-pre:text-gray-300 prose-pre:rounded-xl prose-pre:shadow-lg
            prose-table:border-collapse
            prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-gray-900 prose-th:px-4 prose-th:py-3 prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200
            prose-td:text-sm prose-td:text-gray-600 prose-td:px-4 prose-td:py-2.5 prose-td:border prose-td:border-gray-100
            prose-hr:border-gray-100 prose-hr:my-10
            prose-blockquote:border-emerald-300 prose-blockquote:text-gray-600 prose-blockquote:bg-emerald-50/30 prose-blockquote:rounded-r-lg prose-blockquote:py-1
            prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}