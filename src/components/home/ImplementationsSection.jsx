import SectionReveal from "../SectionReveal";
import CodeBlock from "../CodeBlock";

const languages = ["JavaScript", "Python", "Go", "Rust", "PHP", "Java", "Kotlin", "Swift"];

const coreCode = `sign()
verify()
canonicalize()`;

export default function ImplementationsSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Implementations
              </h2>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                Reference libraries are available for multiple languages.
                Each library implements the core methods.
              </p>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 text-sm font-mono text-gray-600 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.15}>
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Core Methods</p>
              <CodeBlock code={coreCode} language="" className="shadow-xl shadow-gray-900/10" />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}