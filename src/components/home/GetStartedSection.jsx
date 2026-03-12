import SectionReveal from "../SectionReveal";
import { Github, ArrowRight, BookOpen, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  "Create an OpenClaim",
  "Sign it with a private key",
  "Publish it",
  "Verify claims from others",
];

const contributions = ["Libraries", "Test vectors", "Documentation", "Security reviews", "New use cases"];

export default function GetStartedSection() {
  return (
    <section className="bg-black py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal>
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Get Started
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              To start using OpenClaiming:
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm font-bold font-mono flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-300">{step}</span>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mt-16 text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
              <Heart className="w-4 h-4 inline mr-1 text-emerald-400" />
              Open Source — Contributions welcome
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {contributions.map((c) => (
                <span key={c} className="px-3 py-1 text-xs font-mono text-gray-400 bg-white/5 rounded-full border border-white/5">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.25}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/OpenClaiming"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all text-base"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
            <Link
              to="/Docs"
              className="inline-flex items-center gap-2 px-6 py-4 text-emerald-400 hover:text-emerald-300 transition-colors text-base font-medium"
            >
              <BookOpen className="w-5 h-5" />
              Read the documentation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <p className="mt-16 text-center text-sm text-gray-600">
            OpenClaiming is released under a permissive open source license to encourage adoption.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}