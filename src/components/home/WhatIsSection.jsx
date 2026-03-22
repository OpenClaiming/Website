import SectionReveal from "../SectionReveal";
import CodeBlock from "../CodeBlock";
import { FileJson, User, FileText, ShieldCheck } from "lucide-react";

const exampleCode = `{
  "ocp": 1,
  "iss": "https://example.com/alice",
  "sub": "https://example.com/bob",
  "stm": {
    "member": true,
    "role": "admin"
  },
  "nbf": 1712000000,
  "exp": 1750000000,
  "key": "https://example.com/.well-known/openclaiming.json#key1",
  "sig": ["BASE64_SIGNATURE"]
}`;

const states = [
  { icon: User, text: "Who issued the claim" },
  { icon: FileText, text: "Who the claim is about" },
  { icon: FileJson, text: "What the claim says" },
  { icon: ShieldCheck, text: "A signature proving authenticity" },
];

export default function WhatIsSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                What is an OpenClaim?
              </h2>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                An OpenClaim is a signed JSON document.
              </p>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div className="mt-8">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">An OpenClaim states:</p>
                <div className="grid grid-cols-2 gap-4">
                  {states.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white border border-gray-100 hover:border-emerald-200 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <s.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.1}>
            <div className="sticky top-24">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Example</p>
              <CodeBlock code={exampleCode} language="json" className="shadow-2xl shadow-gray-900/10" />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}