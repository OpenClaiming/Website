import { useState } from "react";
import SectionReveal from "../SectionReveal";
import { Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const comparisons = {
  vc: {
    label: "Verifiable Credentials",
    rows: [
      { feature: "Complex schemas", other: true, oc: false },
      { feature: "Required infrastructure", other: "High", oc: "Minimal" },
      { feature: "JSON simplicity", other: "Moderate", oc: "Very simple" },
      { feature: "Decentralized publishing", other: false, oc: true },
      { feature: "Easy implementation", other: false, oc: true },
    ],
    verdict: "OpenClaiming can be used as a lightweight credential format or as a building block inside VC systems.",
  },
  did: {
    label: "Decentralized Identifiers (DID)",
    rows: [
      { feature: "Identity resolution", other: "Primary focus", oc: "Not defined" },
      { feature: "Data model", other: "Identity document", oc: "Signed claim" },
      { feature: "Infrastructure", other: "DID methods", oc: "None required" },
      { feature: "Complementary", other: true, oc: true },
    ],
    verdict: "DIDs identify entities. OpenClaims express statements about those entities. They work well together.",
  },
  dnssec: {
    label: "DNSSEC",
    rows: [
      { feature: "Scope", other: "DNS records", oc: "Arbitrary claims" },
      { feature: "Trust model", other: "Hierarchical root", oc: "Decentralized" },
      { feature: "Data flexibility", other: "Limited", oc: "Flexible JSON" },
      { feature: "Use case", other: "Domain verification", oc: "General statements" },
    ],
    verdict: "OpenClaiming generalizes the idea of signed records beyond DNS. Domains may use DNSSEC identities to sign OpenClaims.",
  },
  https: {
    label: "HTTPS PKI",
    rows: [
      { feature: "Purpose", other: "Secure transport", oc: "Signed statements" },
      { feature: "Trust model", other: "Certificate authorities", oc: "Verifier-defined" },
      { feature: "Data model", other: "X.509 certificates", oc: "JSON claims" },
      { feature: "Scope", other: "TLS connections", oc: "General claims" },
    ],
    verdict: "HTTPS PKI proves control of a domain. OpenClaiming proves signed statements about data. They complement each other.",
  },
};

function CellVal({ val }) {
  if (val === true) return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
  if (val === false) return <X className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span className="text-sm text-gray-600">{val}</span>;
}

export default function ComparisonSection() {
  const [selected, setSelected] = useState("vc");
  const current = comparisons[selected];

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

        <SectionReveal delay={0.1}>
          <div className="mt-10">
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">Select system to compare</label>
            <div className="max-w-md mx-auto">
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(comparisons).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-4">Feature</th>
                  <th className="text-center text-sm font-semibold text-gray-400 px-6 py-4">{current.label}</th>
                  <th className="text-center text-sm font-semibold text-emerald-600 px-6 py-4">OpenClaim</th>
                </tr>
              </thead>
              <tbody>
                {current.rows.map((row, i) => (
                  <tr key={row.feature} className={i < current.rows.length - 1 ? "border-b border-gray-50" : ""}>
                    <td className="text-sm text-gray-700 px-6 py-3.5">{row.feature}</td>
                    <td className="text-center px-6 py-3.5"><CellVal val={row.other} /></td>
                    <td className="text-center px-6 py-3.5 bg-emerald-50/30"><CellVal val={row.oc} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mt-6 p-5 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-sm font-semibold text-emerald-900 mb-2">Verdict</p>
            <p className="text-sm text-emerald-800 leading-relaxed">{current.verdict}</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}