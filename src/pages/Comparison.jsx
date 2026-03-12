import { useState } from "react";
import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";
import { Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const comparisons = {
  vc: {
    label: "Verifiable Credentials",
    rows: [
      { feature: "Complex schemas", vc: true, oc: false },
      { feature: "Required infrastructure", vc: "High", oc: "Minimal" },
      { feature: "JSON simplicity", vc: "Moderate", oc: "Very simple" },
      { feature: "Decentralized publishing", vc: false, oc: true },
      { feature: "Easy implementation", vc: false, oc: true },
    ],
    verdict: "OpenClaiming can be used as a lightweight credential format or as a building block inside VC systems. VC systems may embed OpenClaims as evidence.",
  },
  did: {
    label: "Decentralized Identifiers (DID)",
    rows: [
      { feature: "Identity resolution", vc: "Primary focus", oc: "Not defined" },
      { feature: "Data model", vc: "Identity document", oc: "Signed claim" },
      { feature: "Infrastructure", vc: "DID methods", oc: "None required" },
      { feature: "Complementary", vc: true, oc: true },
    ],
    verdict: "DIDs identify entities. OpenClaims express statements about those entities. They work well together.",
  },
  dnssec: {
    label: "DNSSEC",
    rows: [
      { feature: "Scope", vc: "DNS records", oc: "Arbitrary claims" },
      { feature: "Trust model", vc: "Hierarchical root", oc: "Decentralized" },
      { feature: "Data flexibility", vc: "Limited", oc: "Flexible JSON" },
    ],
    verdict: "OpenClaiming generalizes the idea of signed records beyond DNS. Domains may use DNSSEC identities to sign OpenClaims.",
  },
  https: {
    label: "HTTPS PKI",
    rows: [
      { feature: "Purpose", vc: "Secure transport", oc: "Signed statements" },
      { feature: "Trust model", vc: "Certificate authorities", oc: "Verifier-defined" },
      { feature: "Data model", vc: "Certificates", oc: "JSON claims" },
    ],
    verdict: "HTTPS PKI proves control of a domain. OpenClaiming proves signed statements about data. They complement each other.",
  },
};

function CellVal({ val }) {
  if (val === true) return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
  if (val === false) return <X className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span className="text-sm text-gray-600">{val}</span>;
}

export default function Comparison() {
  const [selected, setSelected] = useState("vc");
  const current = comparisons[selected];

  return (
    <DocLayout title="OpenClaiming vs Other Standards">
      <p className="lead text-lg text-gray-500 !mt-0">
        OpenClaiming introduces a minimal primitive for verifiable statements. Many existing systems solve similar problems.
        This document explains how OpenClaiming relates to them.
      </p>

      <hr />

      <div className="not-prose">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select system to compare</label>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(comparisons).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="not-prose mt-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
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
                <td className="text-center px-6 py-3.5"><CellVal val={row.vc} /></td>
                <td className="text-center px-6 py-3.5 bg-emerald-50/30"><CellVal val={row.oc} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6 p-5 rounded-xl bg-emerald-50 border border-emerald-100">
        <p className="text-sm font-semibold text-emerald-900 mb-2">Verdict</p>
        <p className="text-sm text-emerald-800 leading-relaxed">{current.verdict}</p>
      </div>

      <hr />

      <h1>Why OpenClaiming Exists</h1>
      <p>OpenClaiming focuses on a simple goal:</p>
      <CodeBlock code={`make signed statements easy to create and verify`} language="text" />
      <p>Many existing standards require substantial infrastructure. OpenClaiming attempts to reduce the problem to a minimal primitive that can be reused across systems.</p>

      <hr />

      <h1>Complementary, Not Competitive</h1>
      <p>OpenClaiming is not intended to replace existing standards. Instead, it complements them.</p>
      <CodeBlock code={`DID → identity
OpenClaim → signed statement
Blockchain → timestamp anchoring`} language="text" />
      <p>Each layer solves a different problem.</p>

      <hr />

      <h1>Summary</h1>
      <p>OpenClaiming provides a minimal primitive for verifiable statements.</p>
      <CodeBlock code={`issuer signs statement about subject`} language="text" />
      <p>Because the protocol is simple and decentralized, it can be used across many systems while remaining easy to implement.</p>
    </DocLayout>
  );
}