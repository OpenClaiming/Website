import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function EVMBlockchains() {
  return (
    <DocLayout title="EVM Blockchains">
      <p className="lead text-lg text-gray-500 !mt-0">
        OpenClaiming supports EVM-compatible verification using EIP-712 typed structured data.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>This allows OpenClaims to be:</p>
      <ul>
        <li>verified inside smart contracts</li>
        <li>submitted as authorization payloads</li>
        <li>used directly in on-chain execution flows</li>
      </ul>

      <p>
        Reference: <a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank" rel="noopener noreferrer">EIP-712</a>
      </p>

      <hr />

      <h1>Design Principles</h1>
      <p>OpenClaiming's EVM integration follows strict principles:</p>
      <ul>
        <li><strong>no per-claim schema required</strong></li>
        <li><strong>maximum inference</strong></li>
        <li><strong>deterministic encoding</strong></li>
        <li><strong>canonical struct definitions</strong></li>
        <li><strong>portable across chains and systems</strong></li>
      </ul>

      <blockquote>
        Any valid OpenClaim can be deterministically converted into an EIP-712 payload without additional configuration.
      </blockquote>

      <hr />

      <h1>When EIP-712 Applies</h1>
      <p>EIP-712 signatures are used when:</p>
      <CodeBlock
        code={`{
  "key": {
    "typ": "EIP712"
  }
}`}
        language="json"
      />

      <hr />

      <h1>Domain Inference</h1>
      <p>The EIP-712 domain is <strong>fully inferred</strong>, not provided.</p>

      <h2>Domain Type</h2>
      <CodeBlock code={`EIP712Domain(string name,string version,uint256 chainId)`} language="solidity" />

      <h2>Domain Values</h2>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>name</td>
            <td>derived from extension</td>
          </tr>
          <tr>
            <td>version</td>
            <td><code>"1"</code></td>
          </tr>
          <tr>
            <td>chainId</td>
            <td>extracted from <code>iss</code></td>
          </tr>
        </tbody>
      </table>

      <h2>chainId Extraction</h2>
      <p>From issuer:</p>
      <CodeBlock code={`evm:<chainId>:address:<address>`} language="text" />
      <p>Example:</p>
      <CodeBlock code={`"iss": "evm:53:address:0x..."`} language="json" />
      <p>→ chainId = 53</p>

      <h2>Domain Name</h2>
      <table>
        <thead>
          <tr>
            <th>Extension</th>
            <th>Domain Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>payments</td>
            <td>OpenClaiming.payments</td>
          </tr>
          <tr>
            <td>authorizations</td>
            <td>OpenClaiming.authorizations</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h1>Canonical Structs</h1>
      <p>Each extension has a <strong>fixed canonical struct</strong>.</p>
      <p>No schema needs to be supplied in the claim.</p>

      <h2>Payments Struct</h2>
      <CodeBlock
        code={`Payment(
  string iss,
  string sub,
  bytes32 recipientsHash,
  uint256 max,
  uint256 line,
  uint256 nbf,
  uint256 exp
)`}
        language="solidity"
      />

      <h2>Authorizations Struct</h2>
      <CodeBlock
        code={`Authorization(
  string iss,
  string sub,
  bytes32 actorsHash,
  bytes32 rolesHash,
  bytes32 actionsHash,
  bytes32 constraintsHash,
  bytes32 contextsHash,
  uint256 nbf,
  uint256 exp
)`}
        language="solidity"
      />

      <h2>Nested Types</h2>
      <CodeBlock
        code={`Constraint(string key,string op,string value)
Context(string type,string value)`}
        language="solidity"
      />

      <hr />

      <h1>Canonical Defaults</h1>
      <p>To ensure deterministic encoding:</p>
      <CodeBlock
        code={`actors = []
roles = []
actions = []
constraints = []
contexts = []
nbf = 0
exp = 0
recipients = []`}
        language="text"
      />
      <p>Missing fields MUST be treated as defaults.</p>

      <hr />

      <h1>Hashing Rules</h1>

      <h2>Strings</h2>
      <CodeBlock code={`keccak256(bytes(value))`} language="solidity" />

      <h2>Arrays</h2>
      <ul>
        <li>order MUST be preserved</li>
        <li>each element hashed individually</li>
        <li>combined via abi.encodePacked</li>
      </ul>

      <h2>Example — recipientsHash</h2>
      <CodeBlock
        code={`keccak256(
  abi.encodePacked(
    keccak256(bytes(recipient1)),
    keccak256(bytes(recipient2))
  )
)`}
        language="solidity"
      />

      <h2>Nested Objects</h2>
      <p>Constraints and contexts must be:</p>
      <ul>
        <li>canonicalized</li>
        <li>encoded deterministically</li>
        <li>hashed consistently</li>
      </ul>

      <hr />

      <h1>Final Digest</h1>
      <CodeBlock code={`keccak256("\\x19\\x01" || domainSeparator || structHash)`} language="solidity" />

      <hr />

      <h1>Verification Flow</h1>
      <ol>
        <li>Parse claim</li>
        <li>Extract chainId from <code>iss</code></li>
        <li>Determine extension type</li>
        <li>Apply canonical defaults</li>
        <li>Build struct</li>
        <li>Compute structHash</li>
        <li>Compute domainSeparator</li>
        <li>Recover signer</li>
      </ol>

      <hr />

      <h1>Verifier Contracts and Libraries</h1>
      <p>Implementations may use:</p>
      <ul>
        <li>predeployed verifier contracts</li>
        <li>Solidity libraries</li>
        <li>embedded verification logic</li>
      </ul>

      <p>These components:</p>
      <ul>
        <li>reconstruct canonical structs</li>
        <li>compute EIP-712 hashes</li>
        <li>verify signatures</li>
      </ul>

      <p>This allows OpenClaims to be used directly in smart contracts.</p>

      <hr />

      <h1>Custom Extensions</h1>
      <p>Developers may define additional extensions.</p>

      <h2>Rule</h2>
      <p>Custom extensions MUST define:</p>
      <ul>
        <li>canonical struct name</li>
        <li>canonical field ordering</li>
        <li>deterministic hashing rules</li>
      </ul>

      <h2>Recommended Approach</h2>
      <p>Define schema at key URL:</p>
      <CodeBlock
        code={`{
  "typ": "EIP712",
  "url": "https://example.com/schema.json#MyStruct"
}`}
        language="json"
      />

      <h2>Schema Example</h2>
      <CodeBlock
        code={`{
  "types": {
    "MyStruct": [
      { "name": "field1", "type": "string" },
      { "name": "field2", "type": "uint256" }
    ]
  }
}`}
        language="json"
      />

      <h2>Important</h2>
      <ul>
        <li>canonical OpenClaiming extensions (payments, authorizations) do NOT require schemas</li>
        <li>custom extensions MAY provide them</li>
      </ul>

      <hr />

      <h1>Compatibility</h1>
      <p>This model supports:</p>
      <ul>
        <li>standard EVM wallets</li>
        <li>EIP-712 signing flows</li>
        <li>contract-based verification</li>
        <li>off-chain + on-chain interoperability</li>
      </ul>

      <hr />

      <h1>Security Considerations</h1>
      <p>Implementations must:</p>
      <ul>
        <li>verify chainId matches execution environment</li>
        <li>enforce expiration (<code>exp</code>)</li>
        <li>enforce not-before (<code>nbf</code>)</li>
        <li>validate all constraints</li>
        <li>prevent replay via <code>line</code> or equivalent</li>
      </ul>

      <hr />

      <h1>Summary</h1>
      <p>OpenClaiming's EVM integration provides:</p>
      <ul>
        <li>zero-configuration EIP-712 support</li>
        <li>canonical struct definitions</li>
        <li>deterministic encoding</li>
        <li>compatibility with smart contracts and wallets</li>
      </ul>

      <p>It enables OpenClaims to function as:</p>
      <ul>
        <li>portable authorization primitives</li>
        <li>cross-system verification objects</li>
        <li>on-chain executable permissions</li>
      </ul>
    </DocLayout>
  );
}