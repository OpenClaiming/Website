import SectionReveal from "../SectionReveal";
import { Minimize2, Globe, ShieldCheck, Repeat } from "lucide-react";

const properties = [
  {
    icon: Minimize2,
    title: "Simple",
    desc: "Minimal JSON and a small set of fields. No mandatory registries. No complex schemas.",
  },
  {
    icon: Globe,
    title: "Decentralized",
    desc: "Claims can be published anywhere — .well-known endpoints, APIs, distributed storage, blockchains.",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable",
    desc: "Every claim contains a cryptographic signature that anyone can verify.",
  },
  {
    icon: Repeat,
    title: "Interoperable",
    desc: "Standard JSON and deterministic canonicalization. Implementations can be written in any language.",
  },
];

export default function KeyPropertiesSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">
            Key Properties
          </h2>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((prop, i) => (
            <SectionReveal key={prop.title} delay={i * 0.08}>
              <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center mb-5 transition-colors">
                  <prop.icon className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{prop.title}</h3>
                <p className="mt-2 text-gray-500 leading-relaxed">{prop.desc}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}