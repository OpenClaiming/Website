import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function DesignPhilosophy() {
  return (
    <DocLayout title="Design Philosophy">
      <p className="lead text-lg text-gray-500 !mt-0">
        OpenClaiming provides a minimal primitive for publishing and verifying cryptographically signed statements—a foundation for building decentralized trust systems.
      </p>

      <hr />

      <h1>The Problem</h1>
      <p>Distributed systems need to establish trust without centralized authorities. Questions arise constantly:</p>
      <ul>
        <li>Who controls this identity?</li>
        <li>Does this user belong to this organization?</li>
        <li>Did a trusted party delegate permission?</li>
        <li>Are two accounts controlled by the same entity?</li>
      </ul>
      <p>Existing solutions often require complex infrastructure—decentralized identity stacks, credential frameworks, schema registries. While powerful, they introduce significant overhead.</p>
      <p>OpenClaiming asks: what if all you need is a <strong>cryptographically signed statement</strong>?</p>

      <hr />

      <h1>The Core Idea</h1>
      <p>OpenClaiming reduces trust assertions to a simple format:</p>
      <CodeBlock code={`issuer signs statement about subject`} language="text" />
      <p>This model is intentionally minimal. It allows systems to express claims such as:</p>
      <ul>
        <li><code>example.com claims Alice is a moderator</code></li>
        <li><code>serverA claims latest state of object X is hash H</code></li>
        <li><code>Alice claims Bob may publish to stream Y</code></li>
      </ul>
      <p>All of these statements share the same fundamental structure.</p>

      <hr />

      <h1>Minimal Surface Area</h1>
      <p>The core specification defines only essential fields: version, issuer, subject, statement, timestamps, and signature. This minimal design keeps implementations simple and auditable.</p>

      <hr />

      <h1>JSON as the Universal Format</h1>
      <p>OpenClaiming uses JSON for its universal support and human readability. To ensure consistent signatures across implementations, we use <strong>RFC 8785 JSON Canonicalization</strong>—guaranteeing identical byte representations regardless of language or library.</p>

      <hr />

      <h1>Cryptography First</h1>
      <p>Cryptographic signatures provide authenticity, integrity, and verifiability without trusted intermediaries. No registries, no central authorities—just public-key cryptography.</p>

      <hr />

      <h1>Decentralization</h1>
      <p>OpenClaiming is designed to work without centralized infrastructure. Claims can be published in many ways: web endpoints, distributed storage, application databases, blockchain systems, and peer-to-peer networks.</p>

      <hr />

      <h1>Composability</h1>
      <p>OpenClaiming is intended to be composable. Applications may build more complex systems on top of the primitive, including reputation systems, decentralized identity, access control frameworks, distributed consensus models, and governance protocols.</p>

      <hr />

      <h1>Compatibility with Existing Systems</h1>
      <p>OpenClaiming is designed to work alongside existing standards. It does not attempt to replace them. Examples include:</p>
      <ul>
        <li><strong>HTTPS PKI</strong> — Domains may publish claims using existing HTTPS infrastructure.</li>
        <li><strong>DNSSEC</strong> — Domains may sign claims using DNSSEC-secured identities.</li>
        <li><strong>Verifiable Credentials</strong> — OpenClaims may serve as lightweight credentials within VC ecosystems.</li>
        <li><strong>DIDs</strong> — OpenClaims may reference DID identifiers.</li>
        <li><strong>Blockchains</strong> — Claims may be anchored by storing hashes, signatures, and timestamps.</li>
      </ul>

      <hr />

      <h1>Simplicity over Completeness</h1>
      <p>Most identity standards try to solve everything upfront, creating complex schemas and high implementation costs. OpenClaiming takes the opposite approach: provide a minimal primitive, let applications extend it as needed.</p>

      <hr />

      <h1>Transparency and Accountability</h1>
      <p>Signatures create accountability. Contradictory claims become public evidence of dishonesty—a natural deterrent that works without centralized enforcement.</p>

      <hr />

      <h1>Language Agnostic</h1>
      <p>OpenClaiming is designed to be easy to implement in any programming language. Because the protocol depends only on JSON, canonicalization, and standard cryptography, implementations can remain small and straightforward.</p>

      <hr />

      <h1>Future Evolution</h1>
      <p>Future versions may add optional features—embedded Merkle proofs, additional signature algorithms, ZK proof integrations. But the core principle stays the same:</p>
      <CodeBlock code={`issuer signs statement about subject`} language="text" />

      <hr />

      <h1>A Primitive for Trust</h1>
      <p>OpenClaiming is not an identity system, credential framework, or governance platform. Instead, it provides a primitive that can support all of these.</p>
      <p>By keeping the protocol minimal and flexible, OpenClaiming aims to enable a wide variety of decentralized applications.</p>

      <hr />

      <h1>Summary</h1>
      <p>OpenClaiming reduces trust to its simplest form:</p>
      <CodeBlock code={`A signed statement that anyone can verify.`} language="text" />
      <p>From this primitive, powerful systems emerge.</p>
    </DocLayout>
  );
}