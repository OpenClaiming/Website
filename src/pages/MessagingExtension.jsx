import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function MessagingExtension() {
  return (
    <DocLayout title="Messaging Extension">
      <p className="lead text-lg text-gray-500 !mt-0">
        The messaging extension defines a decentralized, capability-based communication layer for OpenClaiming.
        It enables wallet-to-endpoint communication, identity-bound messaging, programmable access control, and
        decentralized discovery without intermediaries.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>Messaging enables:</p>
      <ul>
        <li>address → endpoint binding</li>
        <li>decentralized inboxes</li>
        <li>programmable spam filtering</li>
        <li>capability-based introductions</li>
        <li>federated communication systems</li>
      </ul>
      <p>Participants can:</p>
      <ul>
        <li>publish how they can be contacted</li>
        <li>define who is allowed to contact them</li>
        <li>receive messages under custom rules</li>
      </ul>

      <hr />

      <h1>Design Principle</h1>
      <p>Messaging is:</p>
      <blockquote>communication infrastructure, not transaction facilitation</blockquote>
      <p>The protocol SHOULD NOT:</p>
      <ul>
        <li>match buyers and sellers</li>
        <li>structure deals</li>
        <li>execute trades</li>
        <li>act as a broker or intermediary</li>
      </ul>
      <p>It only enables:</p>
      <CodeBlock code={`→ verifiable contact between parties`} language="text" />

      <hr />

      <h1>Structure</h1>
      <CodeBlock code={`"messages": [ claims ]`} language="json" />
      <p>Each entry is a full OpenClaim.</p>

      <hr />

      <h1>Claim Shape (Endpoint Claim)</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "wallet identifier",
  "stm": {
    "endpoint": "https://example.com/ocp-inbox",
    "protocol": "https",
    "capabilities": {
      "type": "threshold",
      "rule": "2-of-5"
    }
  },
  "key": [...],
  "sig": [...]
}`}
        language="json"
      />

      <hr />

      <h1>Field Semantics</h1>

      <h2><code>iss</code> (Owner)</h2>
      <p>The wallet or identity that owns the endpoint.</p>
      <CodeBlock code={`"iss": "evm:1:address:0xABC..."`} language="json" />

      <h2><code>stm.endpoint</code></h2>
      <p>The URL or endpoint where messages can be delivered.</p>
      <CodeBlock
        code={`"endpoint": "https://example.com/ocp-inbox"
"endpoint": "https://example.com/webhook"`}
        language="json"
      />
      <p>This endpoint is responsible for:</p>
      <ul>
        <li>receiving messages</li>
        <li>verifying claims</li>
        <li>enforcing policy</li>
      </ul>

      <h2><code>stm.protocol</code></h2>
      <p>Defines how communication occurs.</p>
      <ul>
        <li><code>"https"</code> — HTTP POST messages</li>
        <li><code>"webhook"</code> — event-driven delivery</li>
        <li><code>"p2p"</code> — peer-to-peer messaging</li>
      </ul>

      <h2><code>stm.capabilities</code></h2>
      <p>Defines access requirements for contacting the endpoint.</p>
      <CodeBlock
        code={`"capabilities": {
  "threshold": "2-of-5",
  "gatekeepers": [
    "evm:1:address:0xA...",
    "evm:1:address:0xB..."
  ]
}`}
        language="json"
      />

      <hr />

      <h1>Message Composition & Sending</h1>
      <p>Any website or app that supports OpenClaiming can allow users to:</p>
      <ul>
        <li>compose a message</li>
        <li>sign it with their wallet (EIP-712 or personal_sign)</li>
        <li>send it to an endpoint</li>
        <li>or publish it publicly</li>
      </ul>

      <h2>Example Message Claim</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "evm:1:address:0xSender",
  "sub": "evm:1:address:0xRecipient",
  "stm": {
    "type": "message",
    "body": "Hello, I would like to connect.",
    "timestamp": "1710000000"
  },
  "sig": [...]
}`}
        language="json"
      />

      <h2>Properties</h2>
      <ul>
        <li>message is cryptographically signed</li>
        <li>sender identity is verifiable</li>
        <li>message can be sent directly to endpoint or published publicly (IPFS, web, etc.)</li>
      </ul>

      <hr />

      <h1>Reply Mechanism</h1>
      <p>Recipients determine how to reply by:</p>
      <ul>
        <li>resolving sender identity via OpenClaim</li>
        <li>retrieving sender's endpoint</li>
      </ul>
      <CodeBlock code={`→ bidirectional communication without centralized platforms`} language="text" />

      <hr />

      <h1>Messaging Model</h1>
      <p>Messaging follows a <strong>submit → verify → accept/reject</strong> flow:</p>

      <h2>Step 1 — Endpoint Publication</h2>
      <p>User publishes endpoint claim:</p>
      <ul>
        <li>signed by wallet</li>
        <li>optionally hosted at <code>/.well-known/ocp.json</code> or DNS</li>
      </ul>

      <h2>Step 2 — Discovery</h2>
      <p>Sender:</p>
      <ul>
        <li>identifies recipient wallet</li>
        <li>resolves endpoint via OpenClaim</li>
      </ul>

      <h2>Step 3 — Message Submission</h2>
      <p>Sender submits:</p>
      <ul>
        <li>signed message</li>
        <li>optional capability proofs</li>
      </ul>

      <h2>Step 4 — Verification</h2>
      <p>Receiver endpoint:</p>
      <ul>
        <li>verifies signatures</li>
        <li>evaluates policy</li>
        <li>accepts or rejects</li>
      </ul>

      <hr />

      <h1>Spam Control via Capabilities</h1>
      <p>Spam is controlled through <strong>receiver-defined policies</strong>, not global filters.</p>

      <h2>Endpoint Policy</h2>
      <p>Each endpoint defines rules for accepting messages. Examples:</p>
      <ul>
        <li>require gatekeeper attestations</li>
        <li>require proof-of-work</li>
        <li>require prior relationship</li>
        <li>rate limiting</li>
        <li>stake-based access (future)</li>
      </ul>

      <h2>Gatekeeper Model</h2>
      <p>A user can require:</p>
      <blockquote>sender must be vouched for by M of N trusted gatekeepers</blockquote>

      <h2>Gatekeeper Claim</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "evm:1:address:0xGatekeeper",
  "stm": {
    "attests": "evm:1:address:0xSender",
    "role": "trusted"
  },
  "sig": [...]
}`}
        language="json"
      />

      <h2>Threshold Verification</h2>
      <p>Receiver enforces:</p>
      <CodeBlock code={`valid_attestations >= threshold`} language="text" />

      <hr />

      <h1>Challenge-Based Messaging</h1>
      <p>Endpoints may publish requirements such as:</p>
      <ul>
        <li>"Provide 2 of 5 gatekeeper attestations"</li>
        <li>"Solve proof-of-work challenge"</li>
        <li>"Include signed introduction claim"</li>
      </ul>
      <p>These instructions can be included in endpoint metadata or dynamically returned by the endpoint.</p>

      <h2>Example Flow</h2>
      <CodeBlock
        code={`1. Sender queries endpoint
2. Endpoint responds with requirements
3. Sender gathers proofs
4. Sender submits message + proofs
5. Endpoint verifies and accepts`}
        language="text"
      />

      <hr />

      <h1>Delegation</h1>
      <p>Capabilities may be:</p>
      <ul>
        <li>delegated</li>
        <li>scoped to subtrees</li>
        <li>revoked</li>
      </ul>

      <h2>Example Tree</h2>
      <CodeBlock
        code={`root
 ├── gatekeeper A
 ├── gatekeeper B
 └── messaging subtree`}
        language="text"
      />

      <h2>Properties</h2>
      <ul>
        <li>fine-grained control</li>
        <li>hierarchical trust</li>
        <li>instant revocation</li>
      </ul>
      <p>If a gatekeeper misbehaves:</p>
      <CodeBlock code={`→ revoke subtree → all downstream trust invalidated`} language="text" />

      <hr />

      <h1>Endpoint Verification (Non-Interactive)</h1>
      <p>Endpoints can be verified via:</p>

      <h2>Option 1 — /.well-known</h2>
      <CodeBlock code={`https://example.com/.well-known/ocp.json`} language="text" />

      <h2>Option 2 — DNS</h2>
      <CodeBlock code={`_ocp.example.com → TXT record`} language="text" />

      <p>Result:</p>
      <ul>
        <li>no user interaction required</li>
        <li>no email confirmation</li>
        <li>fully automated verification</li>
      </ul>

      <hr />

      <h1>Federation Model</h1>
      <p>Users may:</p>
      <ul>
        <li>host their own endpoint</li>
        <li>receive messages via webhook</li>
        <li>control storage and filtering</li>
      </ul>
      <CodeBlock code={`→ decentralized inbox per identity`} language="text" />

      <hr />

      <h1>Relation to Other Extensions</h1>
      <table>
        <thead>
          <tr><th>Extension</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>payments</code></td><td>financial authorization</td></tr>
          <tr><td><code>actions</code></td><td>execution authorization</td></tr>
          <tr><td><code>messaging</code></td><td>communication + discovery</td></tr>
        </tbody>
      </table>
      <p>Messaging does NOT:</p>
      <ul>
        <li>move funds</li>
        <li>execute logic</li>
        <li>authorize transactions</li>
      </ul>

      <hr />

      <h1>Legal Positioning</h1>
      <p>Messaging is:</p>
      <ul>
        <li>identity + communication infrastructure</li>
        <li>neutral and general-purpose</li>
      </ul>
      <p>It SHOULD NOT:</p>
      <ul>
        <li>facilitate transactions</li>
        <li>organize markets</li>
        <li>match buyers/sellers</li>
      </ul>
      <CodeBlock code={`→ separation from broker / intermediary roles`} language="text" />

      <hr />

      <h1>Summary</h1>
      <p>The messaging extension provides:</p>
      <ul>
        <li>wallet-bound communication endpoints</li>
        <li>signed message transport</li>
        <li>decentralized identity-based messaging</li>
        <li>programmable spam control via capabilities</li>
        <li>delegation and revocation</li>
        <li>federated inbox architecture</li>
      </ul>
      <blockquote>
        secure, permissioned communication between participants without centralized platforms
      </blockquote>
    </DocLayout>
  );
}