import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function Extensions() {
  return (
    <DocLayout title="Extensions">
      <p className="lead text-lg text-gray-500 !mt-0">
        Extensions define standardized claim types for common use cases.
        They extend the OpenClaiming Protocol while preserving its core structure and security model.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>
        Extensions are <strong>top-level fields</strong> whose values are arrays of OpenClaim objects.
      </p>
      <CodeBlock
        code={`{
  "ocp": 1,
  "payments": [ ... ],
  "actions": [ ... ]
}`}
        language="json"
      />
      <p>Each entry is a <strong>nested OpenClaim</strong>.</p>

      <hr />

      <h1>Design Principle</h1>
      <p>Extensions are not raw data structures. They are:</p>
      <blockquote>
        <strong>first-class signed claims with standardized semantics</strong>
      </blockquote>
      <p>This means every extension entry:</p>
      <ul>
        <li>can be independently verified</li>
        <li>can use its own signing format (<code>fmt</code>)</li>
        <li>can have its own keys and signatures</li>
        <li>follows the same trust model as the base protocol</li>
      </ul>

      <hr />

      <h1>Why Extensions Use Nested OpenClaims</h1>
      <p>Each extension entry is a full OpenClaim to preserve:</p>

      <h2>1. Uniform security</h2>
      <p>Every entry supports:</p>
      <ul>
        <li>multisignature (<code>key</code>, <code>sig</code>)</li>
        <li>canonicalization (for ES256)</li>
        <li>time bounds (<code>nbf</code>, <code>exp</code>)</li>
        <li>replay protection (<code>nce</code>)</li>
      </ul>

      <h2>2. Independent verification</h2>
      <p>Each extension claim can be extracted, cached, transmitted, and verified on its own.</p>

      <h2>3. Consistent semantics</h2>
      <table>
        <thead>
          <tr><th>Field</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>iss</code></td><td>authority / issuer</td></tr>
          <tr><td><code>sub</code></td><td>subject</td></tr>
          <tr><td><code>key</code></td><td>who can sign</td></tr>
          <tr><td><code>sig</code></td><td>signatures</td></tr>
        </tbody>
      </table>

      <h2>4. Multiple formats</h2>
      <p>Each nested claim defines its own <code>fmt</code>, allowing mixing of ES256 and EIP712 within the same document.</p>

      <hr />

      <h1>Structure</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "<extension_name>": [
    {
      "ocp": 1,
      "fmt": "...",
      "iss": "...",
      "sub": "...",
      "stm": { ... },
      "key": [ ... ],
      "sig": [ ... ]
    }
  ]
}`}
        language="json"
      />

      <hr />

      <h1>Format (<code>fmt</code>)</h1>
      <p>Each extension claim defines its own signing format.</p>

      <h2>Supported formats (v1)</h2>
      <table>
        <thead>
          <tr><th>Format</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>ES256</code></td><td>JSON canonicalization + P-256</td></tr>
          <tr><td><code>EIP712</code></td><td>Typed structured data (EVM)</td></tr>
        </tbody>
      </table>

      <h2>Default</h2>
      <p>If <code>fmt</code> is omitted, <code>"fmt": "ES256"</code> is assumed.</p>

      <hr />

      <h1>ES256 vs EIP712</h1>

      <h2>ES256 (default)</h2>
      <ul>
        <li>Uses RFC 8785 canonical JSON</li>
        <li>Supports full JSON structures: long strings, arbitrary JSON, nested structures</li>
        <li>Suitable for servers, APIs, Qbix communities, off-chain validation</li>
      </ul>

      <h2>EIP712</h2>
      <ul>
        <li>Uses fixed typed structs — no JSON canonicalization</li>
        <li>Limited to basic types: <code>address</code>, <code>uint256</code>, <code>bytes32</code>, <code>bytes</code>, <code>bool</code></li>
        <li>Used for smart contracts, on-chain verification, gas-efficient execution</li>
      </ul>

      <h2>Important Constraint</h2>
      <p>EIP712 claims are <strong>not fully extensible</strong>. They must map to a predefined schema with fixed struct definitions and type-converted identifiers. Therefore:</p>
      <blockquote>
        Only standardized extensions define EIP712 mappings.
      </blockquote>

      <hr />

      <h1>Standard Extensions (v1)</h1>
      <p>OpenClaiming defines two standard extensions:</p>
      <table>
        <thead>
          <tr><th>Extension</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>payments</code></td><td>value transfer authorization</td></tr>
          <tr><td><code>actions</code></td><td>execution authorization (invocations)</td></tr>
        </tbody>
      </table>

      <hr />

      <h1>Payments Extension</h1>
      <p>The <code>payments</code> extension defines <strong>spending authorizations</strong>.</p>

      <h2>Semantics</h2>
      <p>A payment claim authorizes a payer (<code>iss</code>), an asset (<code>sub</code>), a set of acceptable recipients, a maximum cumulative amount, and a replay / capacity bucket. It does <strong>not</strong> define how the payment must be executed.</p>

      <h2>Example (ES256)</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "payments": [
    {
      "ocp": 1,
      "iss": "community",
      "sub": "token",
      "stm": {
        "recipients": ["alice"],
        "max": "1000000",
        "line": "1"
      },
      "key": ["data:key/es256;base64,..."],
      "sig": ["BASE64_SIGNATURE"]
    }
  ]
}`}
        language="json"
      />

      <h2>Example (EIP712)</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "payments": [
    {
      "ocp": 1,
      "fmt": "EIP712",
      "iss": "evm:56:address:0x...",
      "sub": "evm:56:token:0x...",
      "stm": {
        "chainId": "56",
        "verifyingContract": "0x...",
        "recipients": ["evm:56:address:0x..."],
        "max": "3000000",
        "line": "7"
      },
      "key": ["data:key/eip712,evm:56:address:0x..."],
      "sig": ["0x..."]
    }
  ]
}`}
        language="json"
      />

      <h2>Notes</h2>
      <ul>
        <li><code>recipients</code> is a <strong>set</strong>, not a single destination</li>
        <li>execution may choose one or more recipients</li>
        <li>different contracts may interpret the claim differently</li>
      </ul>

      <hr />

      <h1>Actions Extension</h1>
      <p>The <code>actions</code> extension defines <strong>execution authorizations</strong>.</p>

      <h2>Semantics</h2>
      <p>An action claim authorizes an authority (<code>iss</code>), a target (<code>sub</code>), a contract call, and execution rules (quorum, fraction, delay). It represents <strong>intent to execute</strong>, not guaranteed execution.</p>

      <h2>Execution Model</h2>
      <CodeBlock code={`invoke → endorse → quorum → execute`} language="text" />
      <p>Execution depends on: signatures, contract roles, quorum rules, and delays.</p>

      <h2>Example (EIP712)</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "actions": [
    {
      "ocp": 1,
      "fmt": "EIP712",
      "iss": "evm:56:address:0xAuthority",
      "sub": "evm:56:address:0xControl",
      "stm": {
        "chainId": "56",
        "verifyingContract": "0x...",
        "contract": "evm:56:address:0xTarget",
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
}`}
        language="json"
      />

      <h2>Notes</h2>
      <ul>
        <li>actions may not execute immediately</li>
        <li>contracts may impose additional rules</li>
        <li>valid signatures do not guarantee execution</li>
      </ul>

      <hr />

      <h1>Multisignature</h1>
      <p>All extensions use the same multisig model:</p>
      <CodeBlock
        code={`"key": [ ... ],
"sig": [ ... ]`}
        language="json"
      />
      <ul>
        <li>each <code>sig[i]</code> corresponds to <code>key[i]</code></li>
        <li>signatures are validated independently</li>
        <li>duplicates do not count twice</li>
        <li>threshold depends on application or contract</li>
      </ul>

      <hr />

      <h1>Execution Flexibility</h1>
      <p>Extensions define <strong>authorization</strong>, not execution. Execution may be handled by:</p>
      <ul>
        <li>OpenClaiming contract</li>
        <li>Community contracts</li>
        <li>Income contracts</li>
        <li>Governance systems</li>
      </ul>
      <p>Different systems may interpret the same claim differently, within its constraints.</p>

      <hr />

      <h1>Extensibility</h1>
      <p>New extensions may be defined. However:</p>
      <ul>
        <li>ES256 extensions are fully flexible</li>
        <li>EIP712 extensions must define fixed schemas</li>
      </ul>

      <hr />

      <h1>Summary</h1>
      <p>Extensions provide structured, standardized claims while preserving the core OpenClaim model.</p>
      <ul>
        <li>extensions are nested OpenClaims</li>
        <li>each claim defines its own format (<code>fmt</code>)</li>
        <li>ES256 supports full JSON flexibility</li>
        <li>EIP712 supports efficient on-chain execution</li>
        <li><code>payments</code> and <code>actions</code> are the standard extensions</li>
        <li>execution is determined by the verifying system</li>
      </ul>

      <CodeBlock
        code={`OpenClaim = universal signed statement
Extensions = standardized semantics
Formats    = for execution environments`}
        language="text"
      />
    </DocLayout>
  );
}