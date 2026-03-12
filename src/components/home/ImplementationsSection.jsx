import SectionReveal from "../SectionReveal";

const languages = [
  { key: "javascript", label: "JavaScript" },
  { key: "python", label: "Python" },
  { key: "go", label: "Go" },
  { key: "rust", label: "Rust" },
  { key: "php", label: "PHP" },
  { key: "java", label: "Java" },
  { key: "swift", label: "Swift" },
];

export default function ImplementationsSection() {
  const handleLanguageClick = (e, key) => {
    e.preventDefault();
    window.location.href = `/Implementations#${key}`;
    setTimeout(() => {
      const element = document.getElementById(key);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Implementations
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Reference libraries available for multiple languages. Each implements the core methods: sign, verify, and canonicalize.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map(({ key, label }) => (
              <a
                key={key}
                href={`/Implementations#${key}`}
                onClick={(e) => handleLanguageClick(e, key)}
                className="px-5 py-2.5 text-sm font-mono rounded-lg border transition-all bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
                style={{ cursor: 'pointer' }}
              >
                {label}
              </a>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}