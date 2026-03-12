import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function DesignPhilosophy() {
  return (
    <DocLayout title="Design Philosophy">
      <p className="lead text-lg text-gray-500 !mt-0">
        The OpenClaiming Protocol was designed to provide a minimal primitive for publishing and verifying cryptographically signed statements.
      </p>
      <blockquote>
        <p>A cryptographically signed claim that anyone can verify.</p>
      </blockquote>
      <p>From this primitive, more complex trust systems can be constructed.</p>

      <hr />

      <h1>The Problem</h1>
      <p>Modern distributed systems frequently need to answer questions such as:</p>
      <ul>
        <li>Who controls this identity?</li>
        <li>Does this user belong to this organization?</li>
        <li>Has a server observed a particular system state?</li>
        <li>Did a trusted party delegate permission?</li>
        <li>Are two accounts controlled by the same entity?</li>
      </ul>
      <p>Many existing solutions attempt to solve these problems through large frameworks — decentralized identity stacks, credential systems, complex schema registries, and centralized authorities. While these systems provide powerful capabilities, they often introduce significant complexity.</p>
      <p>In many situations, all that is needed is a <strong>signed statement</strong>.</p>

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
      <p>One of the primary goals of OpenClaiming is to minimize the protocol surface area. The core specification defines only a small set of fields: version, issuer, subject, statement, optional timestamps, and signature.</p>
      <p>This small set of primitives allows the protocol to remain easy to implement and audit.</p>

      <hr />

      <h1>JSON as a Universal Format</h1>
      <p>OpenClaiming uses JSON as its base format because JSON is widely supported, human-readable, and natively supported by most programming languages.</p>
      <p>To ensure consistent signatures across languages, OpenClaiming uses <strong>RFC 8785 JSON Canonicalization</strong>. Canonicalization ensures that two implementations will produce the same byte representation for the same claim.</p>

      <hr />

      <h1>Cryptography First</h1>
      <p>OpenClaiming places cryptographic signatures at the center of the protocol. The signature ensures authenticity, integrity, and verifiability.</p>
      <p>The protocol does not require trusted registries, centralized authorities, or specific identity systems. Instead, trust is established through cryptographic verification.</p>

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
      <p>Many identity standards attempt to anticipate every possible use case, resulting in complex schemas, layered protocols, and high implementation costs.</p>
      <p>OpenClaiming intentionally avoids this approach. Instead, the protocol provides a minimal primitive that can be extended by applications.</p>

      <hr />

      <h1>Transparency and Accountability</h1>
      <p>In decentralized systems, signatures create accountability. If an issuer signs contradictory claims, those signatures become public evidence. This creates a <strong>chilling effect</strong>, discouraging dishonest behavior without requiring centralized enforcement.</p>

      <hr />

      <h1>Language Agnostic</h1>
      <p>OpenClaiming is designed to be easy to implement in any programming language. Because the protocol depends only on JSON, canonicalization, and standard cryptography, implementations can remain small and straightforward.</p>

      <hr />

      <h1>Future Evolution</h1>
      <p>OpenClaim v1 focuses on simplicity and broad compatibility. Future versions may introduce optional features such as multisignature claims, embedded public keys, Merkle proofs, claim bundles, and revocation mechanisms.</p>
      <p>However, the core design principle remains unchanged:</p>
      <CodeBlock code={`issuer signs statement about subject`} language="text" />

      <hr />

      <h1>A Primitive for Trust</h1>
      <p>OpenClaiming is not an identity system, credential framework, or governance platform. Instead, it provides a primitive that can support all of these.</p>
      <p>By keeping the protocol minimal and flexible, OpenClaiming aims to enable a wide variety of decentralized applications.</p>

      <hr />

      <h1>Summary</h1>
      <p>OpenClaiming is built around a simple idea:</p>
      <CodeBlock code={`A signed statement that anyone can verify.`} language="text" />
      <p>This small primitive enables powerful systems when combined with application logic, trust policies, and decentralized infrastructure.</p>
    </DocLayout>
  );
}