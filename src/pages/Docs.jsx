import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function Docs() {
  return (
    <DocLayout title="OpenClaiming Documentation">
      <p className="lead text-lg text-gray-500 !mt-0">
        This document describes the <strong>OpenClaiming protocol</strong> and the <strong>OpenClaim v1 format</strong>.
        OpenClaiming defines a minimal standard for creating, publishing, and verifying cryptographically signed claims.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>
        An <strong>OpenClaim</strong> is a signed JSON document representing a statement.
        The protocol allows any system to create claims, sign them, publish them, and verify claims created by others.
      </p>
      <p>OpenClaims can represent identity assertions, permissions, attestations, or any other verifiable statement.</p>

      <hr />

      <h1>OpenClaim v1 Format</h1>
      <p>An OpenClaim is a JSON document with the following structure.</p>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "issuer identifier",
  "sub": "subject identifier",
  "stm": { },
  "nbf": 0,
  "exp": 0,
  "nce": "optional nonce",
  "key": "public key reference",
  "sig": "signature"
}`}
        language="json"
      />

      <hr />

      <h1>Field Definitions</h1>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["ocp", "yes", "protocol version"],
            ["iss", "optional", "issuer of the claim"],
            ["sub", "optional", "subject of the claim"],
            ["stm", "yes", "claim statement payload"],
            ["nbf", "optional", "not-before timestamp"],
            ["exp", "optional", "expiration timestamp"],
            ["nce", "optional", "nonce value"],
            ["key", "optional", "reference to public key"],
            ["sig", "yes", "cryptographic signature"],
          ].map(([field, req, desc]) => (
            <tr key={field}>
              <td><code>{field}</code></td>
              <td>{req}</td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h1>Version Field</h1>
      <CodeBlock code={`"ocp": 1`} language="json" />
      <p>The <code>ocp</code> field identifies the OpenClaim version. Version 1 defines JSON canonicalization, SHA-256 hashing, and P-256 signatures. Future versions may support additional algorithms.</p>

      <hr />

      <h1>Issuer</h1>
      <CodeBlock code={`"iss": "https://example.com/alice"`} language="json" />
      <p>The issuer identifies who created the claim. Common formats include URLs, domain identifiers, application user IDs, and blockchain addresses.</p>

      <hr />

      <h1>Subject</h1>
      <CodeBlock code={`"sub": "https://example.com/bob"`} language="json" />
      <p>The subject identifies the entity the claim refers to. Issuer and subject may be the same.</p>

      <hr />

      <h1>Statement</h1>
      <p>The <code>stm</code> field contains the actual statement.</p>
      <CodeBlock code={`"stm": {
  "member": true,
  "role": "moderator"
}`} language="json" />
      <p>The contents of <code>stm</code> are application-defined.</p>

      <hr />

      <h1>Time Fields</h1>
      <h2>Not Before</h2>
      <CodeBlock code={`"nbf": 1712000000`} language="json" />
      <p>The claim becomes valid at this Unix timestamp.</p>

      <h2>Expiration</h2>
      <CodeBlock code={`"exp": 1750000000`} language="json" />
      <p>The claim expires after this timestamp.</p>

      <hr />

      <h1>Nonce</h1>
      <CodeBlock code={`"nce": "random-string"`} language="json" />
      <p>Optional nonce used to prevent replay or ensure uniqueness.</p>

      <hr />

      <h1>Key Field</h1>
      <CodeBlock code={`"key": "https://example.com/.well-known/openclaiming.json#key1"`} language="json" />
      <p>The <code>key</code> field indicates where the verifier can obtain the public key. This may be a URL, a DID reference, a blockchain key, or an inline key. If omitted, the verifier must determine the public key via other means.</p>

      <hr />

      <h1>Signature</h1>
      <CodeBlock code={`"sig": "BASE64_SIGNATURE"`} language="json" />
      <p>The signature is computed over the canonicalized JSON document. Before signing: remove the <code>sig</code> field, canonicalize JSON, hash the result, and sign the hash.</p>

      <hr />

      <h1>Canonicalization</h1>
      <p>OpenClaiming uses <strong>JSON Canonicalization Scheme (RFC 8785)</strong>. Canonicalization ensures deterministic serialization by sorting keys, normalizing numbers, and removing whitespace differences. This allows claims signed in one language to be verified in another.</p>

      <hr />

      <h1>Signing Process</h1>
      <ol>
        <li>Create the JSON claim object.</li>
        <li>Remove the <code>sig</code> field if present.</li>
        <li>Canonicalize JSON.</li>
        <li>Compute SHA-256 hash.</li>
        <li>Sign the hash with the issuer's private key.</li>
        <li>Encode the signature as Base64.</li>
        <li>Add the <code>sig</code> field.</li>
      </ol>

      <hr />

      <h1>Verification Process</h1>
      <ol>
        <li>Extract the signature.</li>
        <li>Remove the <code>sig</code> field.</li>
        <li>Canonicalize JSON.</li>
        <li>Compute SHA-256 hash.</li>
        <li>Obtain issuer public key.</li>
        <li>Verify the signature.</li>
      </ol>

      <hr />

      <h1>Publishing Claims</h1>
      <p>OpenClaims may be published anywhere.</p>

      <h3>Well-Known Endpoints</h3>
      <CodeBlock code={`https://example.com/.well-known/openclaim.json`} language="text" />

      <h3>Application APIs</h3>
      <CodeBlock code={`GET /claims/{id}`} language="text" />

      <h3>Distributed Storage</h3>
      <p>Claims may be stored on IPFS, distributed databases, or peer-to-peer networks.</p>

      <h3>Blockchains</h3>
      <p>Claims may be anchored on-chain by storing claim hashes, signatures, or timestamp anchoring.</p>

      <hr />

      <h1>Key Discovery</h1>
      <p>Public keys used to verify claims may be discovered via well-known endpoints, key registries, identity profiles, or blockchain smart contracts.</p>
      <CodeBlock code={`{
  "keys": [
    {
      "id": "key1",
      "type": "P256",
      "public": "BASE64_KEY"
    }
  ]
}`} language="json" />

      <hr />

      <h1>Security Considerations</h1>
      <p>Implementations should consider replay attacks, key rotation, expiration enforcement, canonicalization correctness, and signature verification failures.</p>
      <p>Claims should be rejected if the signature is invalid, required fields are missing, or expiration has passed.</p>

      <hr />

      <h1>Recommended Algorithms (v1)</h1>
      <table>
        <thead>
          <tr><th>Purpose</th><th>Algorithm</th></tr>
        </thead>
        <tbody>
          <tr><td>Hashing</td><td>SHA-256</td></tr>
          <tr><td>Signature</td><td>ECDSA P-256</td></tr>
          <tr><td>Encoding</td><td>Base64</td></tr>
        </tbody>
      </table>
      <p>Future versions may support Ed25519, Schnorr signatures, multihash, and multisignatures.</p>

      <hr />

      <h1>Test Vectors</h1>
      <p>Reference test vectors are provided in the OpenClaiming repository. They include canonicalization tests, signature tests, and verification tests to ensure compatibility across implementations.</p>

      <hr />

      <h1>Example OpenClaim</h1>
      <p>Example membership claim:</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "https://community.example",
  "sub": "https://users.example/alice",
  "stm": {
    "role": "moderator"
  },
  "nbf": 1712000000,
  "sig": "BASE64_SIGNATURE"
}`} language="json" />

      <hr />

      <h1>Extensions</h1>
      <p>Future versions may introduce multisignature claims, embedded keys, Merkle proof inclusion, claim revocation mechanisms, and claim bundles.</p>

      <hr />

      <h1>Implementations</h1>
      <p>Reference implementations are planned for JavaScript, Python, Go, Rust, PHP, Java, Kotlin, and Swift.</p>
      <p>Each implementation includes canonicalization, signing, verification, and test vectors.</p>

      <hr />

      <h1>Versioning</h1>
      <p>OpenClaim uses semantic versioning.</p>
      <CodeBlock code="OpenClaim v1" language="text" />
      <p>Future versions will remain backwards compatible when possible.</p>

      <hr />

      <h1>Contributing</h1>
      <p>The protocol is developed openly. Contributions are welcome for libraries, test vectors, documentation, security analysis, and interoperability testing.</p>

      <hr />

      <h1>License</h1>
      <p>OpenClaiming documentation and reference implementations are released under a permissive open source license.</p>
    </DocLayout>
  );
}