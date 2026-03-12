import SectionReveal from "../SectionReveal";
import { Check, X, Minus } from "lucide-react";

const rows = [
  { feature: "Complex schemas", vc: true, oc: false },
  { feature: "Required infrastructure", vc: "High", oc: "Minimal" },
  { feature: "JSON simplicity", vc: "Moderate", oc: "Very simple" },
  { feature: "Decentralized publishing", vc: false, oc: true },
  { feature: "Easy implementation", vc: false, oc: true },
];

function CellVal({ val }) {
  if (val === true) return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
  if (val === false) return <X className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span className="text-sm text-gray-600">{val}</span>;
}

export default function ComparisonSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">
            Comparison
          </h2>
          <p className="mt-4 text-lg text-gray-500 text-center max-w-2xl mx-auto">
            OpenClaiming vs other systems
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-4">Feature</th>
                  <th className="text-center text-sm font-semibold text-gray-400 px-6 py-4">Verifiable Credentials</th>
                  <th className="text-center text-sm font-semibold text-emerald-600 px-6 py-4">OpenClaim</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.feature} className={i < rows.length - 1 ? "border-b border-gray-50" : ""}>
                    <td className="text-sm text-gray-700 px-6 py-3.5">{row.feature}</td>
                    <td className="text-center px-6 py-3.5"><CellVal val={row.vc} /></td>
                    <td className="text-center px-6 py-3.5 bg-emerald-50/30"><CellVal val={row.oc} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "DIDs", desc: "DIDs define identity resolution. OpenClaiming defines signed statements. They work well together." },
              { title: "DNSSEC", desc: "DNSSEC proves domain ownership. OpenClaiming generalizes the concept to arbitrary claims." },
              { title: "HTTPS PKI", desc: "HTTPS proves control of a domain. OpenClaiming proves signed statements about data." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-white border border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}