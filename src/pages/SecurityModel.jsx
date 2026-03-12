import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function SecurityModel() {
  return (
    <DocLayout title="Security Model">
      <p className="lead text-lg text-gray-500 !mt-0">
        This document describes the security assumptions and threat model of the <strong>OpenClaiming Protocol</strong>.
      </p>

      <hr />

      <h1>Security Goals</h1>

      <h2>Authenticity</h2>
      <p>A claim must be provably issued by the entity that signed it. This is achieved through asymmetric cryptography.</p>

      <h2>Integrity</h2>
      <p>The contents of a claim must not be modifiable without invalidating the signature. This is ensured by signing the canonicalized JSON representation of the claim.</p>

      <h2>Verifiability</h2>
      <p>Any party should be able to verify a claim without contacting the issuer. Verification requires only the claim and the issuer's public key.</p>

      <h2>Decentralization</h2>
      <p>Claims should not rely on centralized registries. Claims may be published anywhere.</p>

      <hr />

      <h1>Trust Model</h1>
      <p>OpenClaiming does not impose a global trust authority. Instead, trust is determined by the verifier.</p>
      <p>Verifiers decide which issuers to trust, which claims to accept, and how to resolve public keys.</p>

      <hr />

      <h1>Identity Model</h1>
      <p>Identifiers used in claims may include URLs, domain names, application user IDs, blockchain addresses, and decentralized identifiers. The protocol does not constrain identifier formats.</p>

      <hr />

      <h1>Key Ownership</h1>
      <p>Claims are authenticated through public-key cryptography. The issuer must control the private key corresponding to the public key used for verification.</p>
      <p>Public keys may be published through well-known endpoints, identity documents, application APIs, or blockchain registries.</p>

      <hr />

      <h1>Canonicalization Security</h1>
      <p>To prevent signature inconsistencies across languages, OpenClaiming uses <strong>RFC 8785 JSON Canonicalization</strong>.</p>
      <p>This ensures deterministic key ordering, normalized number formats, and consistent serialization. Without canonicalization, different implementations could produce different byte sequences for the same JSON document.</p>

      <hr />

      <h1>Replay Attacks</h1>
      <p>Claims may be replayed if no time constraints exist. To mitigate replay attacks, implementations should use:</p>
      <ul>
        <li><code>nbf</code> (not-before timestamps)</li>
        <li><code>exp</code> (expiration timestamps)</li>
        <li><code>nce</code> (nonces)</li>
      </ul>
      <p>Applications may enforce stricter replay protections depending on context.</p>

      <hr />

      <h1>Key Rotation</h1>
      <p>Issuers should periodically rotate signing keys. Recommended practices include publishing multiple keys simultaneously, marking older keys as deprecated, and allowing verification for historical claims.</p>
      <p>Verifiers should support multiple keys per issuer.</p>

      <hr />

      <h1>Revocation</h1>
      <p>OpenClaiming does not mandate a global revocation system. Possible revocation approaches include claim expiration, issuer-maintained revocation lists, publishing updated claims that supersede older ones, and blockchain anchoring.</p>

      <hr />

      <h1>Signature Algorithms</h1>
      <p>Version 1 recommends:</p>
      <CodeBlock code={`ECDSA P-256\nSHA-256`} language="text" />
      <p>These algorithms are widely supported. Future versions may support Ed25519, Schnorr signatures, and multisignature schemes.</p>

      <hr />

      <h1>Publishing Security</h1>
      <p>Claims may be distributed through untrusted channels. Because claims are cryptographically signed, transport security is not strictly required for verification. However, HTTPS is recommended when claims are served from web endpoints.</p>

      <hr />

      <h1>Privacy Considerations</h1>
      <p>OpenClaims are typically public artifacts. Issuers should avoid embedding sensitive personal data unless explicitly required.</p>
      <p>Possible privacy-preserving approaches include hashing identifiers, referencing external encrypted data, and limiting claim lifetime.</p>

      <hr />

      <h1>Denial of Service</h1>
      <p>Verifiers should validate claim size and structure before performing expensive cryptographic operations. Suggested limits include maximum claim size, maximum nesting depth, and maximum statement payload size.</p>

      <hr />

      <h1>Malicious Issuers</h1>
      <p>The protocol does not prevent malicious issuers from signing false claims. Trust decisions must be made by the verifier. Applications may implement reputation systems or allowlists.</p>

      <hr />

      <h1>Chilling Effects</h1>
      <p>In decentralized systems, signed claims create <strong>cryptographic accountability</strong>. If an issuer signs conflicting claims, the signatures themselves serve as evidence. This discourages dishonest behavior without requiring centralized enforcement.</p>

      <hr />

      <h1>Summary</h1>
      <p>OpenClaiming provides a minimal cryptographic primitive:</p>
      <CodeBlock code={`Signed statement → verifiable by anyone`} language="text" />
      <p>The protocol intentionally leaves policy decisions to applications.</p>
    </DocLayout>
  );
}