import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-800 font-mono">404</p>
        <p className="mt-4 text-xl text-gray-400">Page not found</p>
        <Link
          to="/Home"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}