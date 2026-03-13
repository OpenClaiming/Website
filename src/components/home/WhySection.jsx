import SectionReveal from "../SectionReveal";
import { Globe, Shield, Link2, Server, Network } from "lucide-react";

const needs = [
  { icon: Globe, label: "Identities across domains" },
  { icon: Shield, label: "Roles and permissions" },
  { icon: Server, label: "Attestations from servers" },
  { icon: Link2, label: "Links between accounts" },
  { icon: Network, label: "Signed observations in decentralized systems" },
];

export default function WhySection() {
  return (
    <section id="why" className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              The Need for OpenClaiming Protocol
            </h2>
            <div className="mt-6 text-base text-gray-600 leading-relaxed space-y-4">
              <p>
                Today many systems need verifiable statements — about identities, roles, permissions,
                events, and observations. However, most existing standards require complex infrastructure,
                large schemas, specialized tooling, or centralized registries before anything useful
                can be published or verified.
              </p>

              <p>
                As a result, many developers fall back to ad-hoc solutions such as unsigned JSON,
                custom API responses, proprietary tokens, or opaque database records. These approaches
                make interoperability difficult and prevent third parties from independently verifying
                the truth of a statement.
              </p>

              <p>
                OpenClaiming focuses on a simpler primitive:
              </p>

              <p className="text-xl font-semibold text-gray-900">
                A signed claim that anyone can verify.
              </p>

              <p>
                Instead of introducing new identity frameworks or credential registries, OpenClaiming
                defines a minimal signed JSON document that can be published anywhere and verified
                using standard public-key cryptography. This allows systems to exchange verifiable
                statements without requiring shared infrastructure or prior trust relationships.
              </p>

              <p>
                This simple primitive can support many common needs:
              </p>
            </div>
          </div>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {needs.map((item, i) => (
            <SectionReveal key={item.label} delay={i * 0.08}>
              <div className="flex items-start gap-3 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all">
                <item.icon className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.4}>
          <div className="mt-8 max-w-3xl">
            <p className="text-base text-gray-600 leading-relaxed">
              OpenClaiming intentionally avoids unnecessary complexity. It can coexist with
              larger credential systems or serve as a lightweight building block inside them.
              For a comparison with existing standards and approaches, see{" "}
              <a href="#comparison" className="text-emerald-600 hover:text-emerald-700 font-medium">the comparison section</a>.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}