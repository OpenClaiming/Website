import SectionReveal from "../SectionReveal";

const steps = [
  { num: "01", title: "Create", desc: "A system creates a claim as a JSON document." },
  { num: "02", title: "Canonicalize", desc: "The JSON document is canonicalized for deterministic serialization." },
  { num: "03", title: "Sign", desc: "The issuer signs the document with a private key." },
  { num: "04", title: "Publish", desc: "The claim is published anywhere — APIs, storage, blockchains." },
  { num: "05", title: "Verify", desc: "Anyone can verify the claim with the issuer's public key." },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl">
            Because the signature is public-key based, verification requires no trusted intermediary.
          </p>
        </SectionReveal>

        <div className="mt-16">
          <div className="max-w-2xl space-y-6">
            {steps.map((step, i) => (
              <SectionReveal key={step.num} delay={i * 0.1}>
                <div className="flex gap-4 items-start p-6 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-emerald-500 font-mono">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}