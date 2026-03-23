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
  "key": "public key reference or array",
  "sig": ["BASE64_SIGNATURE", ...]
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
            ["key", "optional", "key(s) corresponding to signatures (object, string, or array)"],
            ["sig", "yes", "array of Base64-encoded signatures"],
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
      <p>The <code>ocp</code> field identifies the OpenClaim version. Version 1 standardizes JSON canonicalization, SHA-256 hashing, and P-256 signatures. Future versions may support additional algorithms.</p>

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

      <h1>Extensions</h1>
      <p>
        Extensions are top-level fields that define standardized claim formats for common use cases.
        They exist alongside core fields such as <code>nbf</code> and <code>exp</code>, and are not part of <code>stm</code>.
      </p>
      <p>
        While <code>stm</code> remains freeform, extensions ensure interoperability by defining consistent schemas.
      </p>

      <h2>Standard Extensions (v1)</h2>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>payments</code></td>
            <td>optional</td>
            <td>array of payment claims</td>
          </tr>
          <tr>
            <td><code>authorizations</code></td>
            <td>optional</td>
            <td>array of authorization claims</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h1>Signature</h1>
      <CodeBlock code={`"sig": ["SIGNATURE", ...]`} language="json" />
      <p>Each signature is computed over the canonicalized JSON document. Before signing: remove the <code>sig</code> field, canonicalize JSON, hash the result, and sign the hash.</p>
      <p>Each signature corresponds to the key at the same index. The encoding and verification method of each signature is determined by the corresponding key.</p>

      <h2>Signature Encodings (v1)</h2>
      <table>
        <thead>
          <tr><th>Format</th><th>Encoding</th></tr>
        </thead>
        <tbody>
          <tr><td>ES256</td><td>Base64 DER</td></tr>
          <tr><td>EIP712</td><td>Hex (0x-prefixed)</td></tr>
        </tbody>
      </table>

      <hr />

      <h1>Key Field</h1>
      <h2>Definition</h2>
      <CodeBlock code={`"key": STRING | ARRAY<STRING>`} language="json" />
      <p>
        The <code>key</code> field defines how to obtain the public key(s) used for verification.
        Each key MUST be a string. Supported forms include:
      </p>
      <ul>
        <li>Data URLs (embedded keys)</li>
        <li>HTTPS URLs (remote key discovery)</li>
        <li>Identifier-based formats (e.g. EIP-712 signers)</li>
      </ul>
      <CodeBlock code={`"key": [
  "data:key/es256;base64,MIIB...",
  "https://example.com/.well-known/openclaim.json#keys"
]`} language="json" />

      <h2>Key Rules</h2>
      <ul>
        <li>Keys MUST be strings</li>
        <li>Keys MUST be sorted lexicographically</li>
        <li>Keys MUST be unique</li>
        <li>If <code>key</code> is an array, it MUST correspond 1:1 with <code>sig</code></li>
        <li>If <code>key</code> is a string, it applies to all signatures</li>
      </ul>

      <h2>Key Types</h2>
      <table>
        <thead>
          <tr><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>data:key/es256</code></td><td>embedded P-256 key (non-revocable)</td></tr>
          <tr><td><code>data:key/eip712</code></td><td>EVM signer (non-revocable)</td></tr>
          <tr><td><code>https://...</code></td><td>remote key set (revocable)</td></tr>
        </tbody>
      </table>

      <hr />

      <h1>Canonicalization</h1>
      
      <h2>JSON as the Universal Format</h2>
      <p>OpenClaiming uses JSON for its universal support and human readability. To ensure consistent signatures across implementations, we use <strong>RFC 8785 JSON Canonicalization</strong>—guaranteeing identical byte representations regardless of language or library.</p>
      
      <p>Downstream, the claim can be canonicalized, hashed and signed using various standards.</p>

      <p><strong>Important:</strong> Canonicalization applies only to the claim JSON itself. Resolved keys, fetched data, and external resources MUST NOT affect canonicalization.</p>

      <h2>ES256 (ECDSA using P-256 and SHA-256)</h2>
      <p>The default signature type for OpenClaiming is <strong>ES256</strong>, which uses:</p>
      <ul>
        <li>ECDSA (Elliptic Curve Digital Signature Algorithm)</li>
        <li>P-256 curve (also known as secp256r1 or prime256v1)</li>
        <li>SHA-256 hashing</li>
      </ul>
      <p>ES256 is the standard for JSON Web Signatures (JWS) and is supported natively in most cryptographic libraries.</p>

      <h2>EIP-712 (Separate Signing Profile)</h2>
      <p>EIP-712 is a <strong>separate signing profile</strong> and does NOT sign canonical JSON. Instead:</p>
      <ul>
        <li>Claims are converted into typed structured data</li>
        <li>Fields are mapped into fixed structs per extension</li>
        <li>Addresses and numeric values are derived from identifiers</li>
      </ul>
      <p>EIP-712 canonicalization is extension-specific and MUST NOT be inferred from arbitrary JSON structure. For complete details, see <a href="/EVMBlockchains">EVM Blockchains</a>.</p>

      <hr />

      <h1>Signing Process</h1>
      <ol>
        <li>Create the JSON claim object.</li>
        <li>Remove the <code>sig</code> field if present.</li>
        <li>Canonicalize JSON.</li>
        <li>Compute SHA-256 hash.</li>
        <li>Sign the hash with the issuer's private key.</li>
        <li>Encode the signature as Base64.</li>
        <li>Add the <code>sig</code> field as an array of signatures.</li>
      </ol>

      <hr />

      <h1>Verification Process</h1>
      <ol>
        <li>Receive claim</li>
        <li>Canonicalize JSON (without <code>sig</code>)</li>
        <li>Resolve keys</li>
        <li>Verify each signature against its corresponding key</li>
        <li>Check time constraints (<code>nbf</code>, <code>exp</code>)</li>
        <li>Apply extension-specific logic</li>
        <li>Accept or reject claim</li>
      </ol>

      <hr />

      <h1>Identifier Model</h1>
      <p>Identifiers used in <code>iss</code>, <code>sub</code>, and <code>stm</code> fields are opaque strings interpreted by applications. Recommended format:</p>
      <CodeBlock code={`<ecosystem>:<chain>:<type>:<value>`} language="text" />
      <p>Examples:</p>
      <CodeBlock code={`"iss": "evm:56:address:0xabc..."
"sub": "evm:56:token:0xdef..."`} language="json" />
      <p>Identifiers are NOT keys and MUST NOT use data URLs.</p>

      <hr />

      <h1>Design Principle</h1>
      <p>OpenClaim separates:</p>
      <ul>
        <li><strong>Identity</strong> — <code>iss</code>, <code>sub</code></li>
        <li><strong>Cryptographic verification</strong> — <code>key</code>, <code>sig</code></li>
        <li><strong>Execution semantics</strong> — extensions</li>
      </ul>

      <hr />

      <h1>EIP-712 Support (v1)</h1>
      <p>OpenClaiming supports EIP-712 as a separate signing profile for on-chain verification. Domain parameters are inferred deterministically from the claim:</p>
      <table>
        <thead>
          <tr><th>Field</th><th>Source</th></tr>
        </thead>
        <tbody>
          <tr><td><code>chainId</code></td><td>extracted from <code>iss</code></td></tr>
          <tr><td><code>name</code></td><td>derived from extension (OpenClaiming.payments, etc.)</td></tr>
          <tr><td><code>version</code></td><td>"1"</td></tr>
        </tbody>
      </table>
      <p>No domain or schema needs to be specified explicitly. All values are inferred deterministically from the claim.</p>

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
  "key": [
    "data:key/es256;base64,MIIB..."
  ],
  "sig": ["BASE64_SIGNATURE"]
}`} language="json" />

      <hr />

      <h1>Summary</h1>
      <p>OpenClaim v1 defines:</p>
      <ul>
        <li>Deterministic canonical JSON signing</li>
        <li>Key resolution via URLs and data URLs</li>
        <li>Multi-signature support via <code>key</code>/<code>sig</code> arrays</li>
        <li>Optional extensions using nested claims</li>
        <li>Flexible trust models including revocable and immutable claims</li>
      </ul>

      <hr />

      <h1>Future Extensions</h1>
      <p>Future versions may introduce Merkle proof inclusion, claim revocation mechanisms, and claim bundles.</p>

      <hr />

      <h1>Implementations</h1>
      <p>Reference implementations are available for JavaScript, Python, Go, Rust, PHP, Java, Kotlin, and Swift.</p>
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