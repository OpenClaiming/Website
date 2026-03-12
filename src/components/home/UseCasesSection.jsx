import SectionReveal from "../SectionReveal";
import CodeBlock from "../CodeBlock";
import { Fingerprint, Users, Key, Globe, Server, Link2 } from "lucide-react";

const useCases = [
  {
    icon: Fingerprint,
    title: "Identity Linking",
    desc: "Multiple sites post claims signed by the same key.",
    example: (
      <span>
        Multiple sites post claims signed by{" "}
        <span className="text-emerald-400">alice@groups.app</span> with the same private key, at{" "}
        <span className="text-emerald-400 whitespace-nowrap">./well-known/claiming/groups.app/alice.json</span>
      </span>
    ),
  },
  {
    icon: Users,
    title: "Membership",
    desc: "Organizations can publish signed membership records.",
    example: "Community X claims Alice\nis an administrator",
  },
  {
    icon: Key,
    title: "Capability Delegation",
    desc: "One party grants permission to another.",
    example: "Alice grants Bob a role\nin a community",
  },
  {
    icon: Globe,
    title: "Cross-Domain API Calls",
    desc: "Server proves domain control and signs API calls.",
    example: "Server A posts claim proving it\ncontrols Domain A, and signs API\ncalls to servers controlling Domain B",
  },
  {
    icon: Server,
    title: "Signed Observations",
    desc: "Servers can publish signed observations.",
    example: "Server A claims the latest\nhash of stream S is H",
  },
  {
    icon: Link2,
    title: "Blockchain Anchoring",
    desc: "OpenClaims can be anchored to blockchains by storing hashes, signatures, and timestamps.",
    example: "Immutability while keeping\nthe claim itself lightweight",
  },
];

export default function UseCasesSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Example Use Cases
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl">
            These claims create cryptographic accountability.
          </p>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <SectionReveal key={uc.title} delay={i * 0.06}>
              <div className="h-full p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg hover:shadow-gray-900/5 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                  <uc.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{uc.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{uc.desc}</p>
                <div className="mt-4 p-3 rounded-lg bg-gray-950 text-gray-400 text-xs font-mono leading-relaxed whitespace-pre-line">
                  {typeof uc.example === "string" ? uc.example : uc.example}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}