import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const docNav = [
  { label: "Protocol Spec", path: "/Docs" },
  { label: "Security Model", path: "/SecurityModel" },
  { label: "Protocol Examples", path: "/ProtocolExamples" },
  { label: "Design Philosophy", path: "/DesignPhilosophy" },
  { label: "Implementations", path: "/Implementations" },
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
          <div className="prose prose-gray max-w-none
            prose-headings:tracking-tight prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-8 prose-h1:first:mt-0 prose-h1:pb-4 prose-h1:border-b-2 prose-h1:border-gray-200 prose-h1:text-gray-900
            prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-gray-900
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-gray-800 prose-h3:font-semibold
            prose-p:text-base prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:mb-5
            prose-li:text-base prose-li:text-gray-700 prose-li:leading-[1.8] prose-li:mb-3
            prose-ul:space-y-3 prose-ul:my-6 prose-ul:pl-6
            prose-ol:space-y-3 prose-ol:my-6 prose-ol:pl-6
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-mono prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-950 prose-pre:text-gray-300 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:my-8 prose-pre:border prose-pre:border-gray-800
            prose-table:border-collapse prose-table:my-8 prose-table:w-full
            prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-gray-900 prose-th:px-4 prose-th:py-3 prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200
            prose-td:text-sm prose-td:text-gray-700 prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-gray-100
            prose-hr:border-gray-200 prose-hr:my-14
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:text-gray-800 prose-blockquote:bg-emerald-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:font-normal prose-blockquote:italic
            prose-a:text-emerald-600 prose-a:no-underline prose-a:font-medium prose-a:transition-colors hover:prose-a:underline hover:prose-a:text-emerald-700
            [&_.lead]:text-xl [&_.lead]:text-gray-600 [&_.lead]:leading-relaxed [&_.lead]:mb-8
          ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}