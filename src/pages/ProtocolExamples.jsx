import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function ProtocolExamples() {
  return (
    <DocLayout title="Protocol Examples">
      <p className="lead text-lg text-gray-500 !mt-0">
        Practical examples of how OpenClaiming may be used. These examples illustrate common real-world flows.
      </p>

      <hr />

      <h1>Example 1 — Domain Identity Claim</h1>
      <p>A domain may publish claims linking identities.</p>
      <p><strong>Claim:</strong> example.com claims alice@example.com controls @alice on another platform</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "https://example.com",
  "sub": "alice@example.com",
  "stm": {
    "linked_account": "@alice"
  },
  "key": [
    "data:key/es256;base64,MIIB..."
  ],
  "sig": ["BASE64_SIGNATURE"]
}`} language="json" />
      <p>Publication: <code>https://example.com/.well-known/openclaim.json</code></p>

      <hr />

      <h1>Example 2 — Community Membership</h1>
      <p>An organization publishes membership records.</p>
      <p><strong>Claim:</strong> Community X claims Alice is a moderator</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "https://community.example",
  "sub": "https://users.example/alice",
  "stm": {
    "role": "moderator"
  },
  "exp": 1750000000,
  "key": [
    "https://community.example/.well-known/openclaim.json#keys"
  ],
  "sig": ["BASE64_SIGNATURE"]
}`} language="json" />

      <hr />

      <h1>Example 3 — Capability Delegation</h1>
      <p>A user delegates permission to another user.</p>
      <p><strong>Claim:</strong> Alice allows Bob to publish to stream Y</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "evm:1:address:0xAlice...",
  "sub": "evm:1:address:0xBob...",
  "stm": {
    "permission": "publish",
    "resource": "streamY"
  },
  "key": [
    "data:key/es256;base64,MIIB..."
  ],
  "sig": ["BASE64_SIGNATURE"]
}`} language="json" />

      <hr />

      <h1>Example 4 — Server Observation</h1>
      <p>A server signs an observation about a system state.</p>
      <p><strong>Claim:</strong> Server A claims latest hash of stream Z is H</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "https://serverA.example",
  "stm": {
    "stream": "Z",
    "latest_hash": "H"
  },
  "key": [
    "https://serverA.example/.well-known/openclaim.json#keys"
  ],
  "sig": ["BASE64_SIGNATURE"]
}`} language="json" />
      <p>Multiple servers may independently sign observations. Conflicting claims reveal dishonest actors.</p>

      <hr />

      <h1>Example 5 — Cross-Domain Identity</h1>
      <p>Two domains may confirm a shared identity.</p>
      <p><strong>Claim:</strong> siteA claims user123 equals siteB user456</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "https://siteA.example",
  "sub": "https://siteA.example/user123",
  "stm": {
    "same_as": "evm:1:address:0xSiteB..."
  },
  "key": [
    "data:key/es256;base64,MIIB..."
  ],
  "sig": ["BASE64_SIGNATURE"]
}`} language="json" />

      <hr />

      <h1>Example 6 — Blockchain Anchoring</h1>
      <p>Claims can be anchored to blockchains. Instead of storing full JSON, systems may store:</p>
      <CodeBlock code={`hash(OpenClaim)`} language="text" />
      <p>Benefits include timestamped proof, tamper resistance, and public auditability. The claim itself remains off-chain.</p>

      <hr />

      <h1>Example 7 — Session Authentication</h1>
      <p>Applications may issue claims representing active sessions.</p>
      <p><strong>Claim:</strong> Server claims session key K belongs to user Alice</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "https://auth.example",
  "sub": "https://users.example/alice",
  "stm": {
    "session_key": "PUBLIC_KEY"
  },
  "exp": 1712003600,
  "key": [
    "https://auth.example/.well-known/openclaim.json#keys"
  ],
  "sig": ["BASE64_SIGNATURE"]
}`} language="json" />
      <p>Clients can present signed requests using the session key.</p>

      <hr />

      <h1>Example 8 — Intercloud Attestations</h1>
      <p>Distributed nodes may publish claims about system state.</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "https://nodeA.example",
  "stm": {
    "object": "X",
    "hash": "H"
  },
  "key": [
    "data:key/es256;base64,MIIB..."
  ],
  "sig": ["BASE64_SIGNATURE"]
}`} language="json" />
      <p>Dishonest nodes are exposed if their signatures contradict each other.</p>

      <hr />

      <h1>Example 9 — Multi-Signature Claim</h1>
      <p>A claim signed by multiple parties using different key types.</p>
      <CodeBlock code={`{
  "ocp": 1,
  "iss": "https://org.example",
  "sub": "https://users.example/bob",
  "stm": {
    "approved": true
  },
  "key": [
    "data:key/es256;base64,MIIB...",
    "data:key/eip712;base64,0xSigner..."
  ],
  "sig": [
    "BASE64_DER_SIGNATURE",
    "0xHEX_EIP712_SIGNATURE"
  ]
}`} language="json" />

      <hr />

      <h1>Example 10 — Multi-Step Execution (Actions)</h1>
      <p>A governance action requiring multiple approvals before execution.</p>
      <CodeBlock code={`{
  "ocp": 1,
  "actions": [
    {
      "ocp": 1,
      "iss": "evm:56:address:0xAuthority",
      "sub": "evm:56:address:0xControlContract",
      "stm": {
        "contract": "evm:56:address:0xToken",
        "method": "a9059cbb",
        "params": "000000...",
        "minimum": "2",
        "fraction": "5000000000",
        "delay": "3600"
      },
      "key": [
        "data:key/eip712,evm:56:address:0xSigner1",
        "data:key/eip712,evm:56:address:0xSigner2"
      ],
      "sig": [
        "0x...",
        "0x..."
      ]
    }
  ]
}`} language="json" />
      <p>This maps to a ControlContract flow: <strong>invoke → endorse → quorum → execute</strong>. Execution is NOT guaranteed immediately — quorum and delay conditions must be met.</p>

      <hr />

      <h1>Claim Bundles</h1>
      <p>Multiple claims may be distributed together.</p>
      <CodeBlock code={`{
  "claims": [
    { ... },
    { ... },
    { ... }
  ]
}`} language="json" />
      <p>Bundles may be used for identity profiles, organization records, and capability sets.</p>

      <hr />

      <h1>Verification Flow</h1>
      <CodeBlock code={`Receive claim
↓
Canonicalize JSON (without sig)
↓
Resolve keys
↓
Verify each signature against corresponding key
↓
Check time constraints
↓
Apply extension-specific logic
↓
Accept or reject claim`} language="text" />

      <hr />

      <h1>Real-World Scenarios</h1>
      <p>OpenClaiming is applicable in many environments: identity systems, decentralized networks, access control systems, blockchain integrations, reputation systems, and distributed collaboration platforms.</p>

      <hr />

      <h1>Summary</h1>
      <p>OpenClaiming provides a minimal primitive: a <strong>cryptographically signed statement</strong>. From this simple building block, systems can implement identity assertions, permission delegation, system attestations, and decentralized trust models.</p>
    </DocLayout>
  );
}