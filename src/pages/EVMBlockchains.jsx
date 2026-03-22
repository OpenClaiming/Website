import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function EVMBlockchains() {
  return (
    <DocLayout title="EVM Blockchains">
      <p className="lead text-lg text-gray-500 !mt-0">
        OpenClaiming on EVM blockchains uses canonical EIP-712 typed data.
        All OpenClaiming JSON is processed off-chain. On-chain contracts operate only on typed Solidity structs and signature bytes.
      </p>

      <hr />

      <h1>Core Design</h1>
      <p>The EVM integration follows these principles:</p>
      <ul>
        <li><strong>No string parsing on-chain</strong></li>
        <li><strong>No JSON parsing on-chain</strong></li>
        <li><strong>No schema passed dynamically</strong></li>
      </ul>

      <p>Instead, the workflow is:</p>
      <CodeBlock
        code={`Off-chain:
- Parse OCP JSON
- Build canonical struct
- Compute hashes
- Sign

On-chain:
- Receive struct + signature
- Recompute hash
- Verify
- Execute`}
        language="text"
      />

      <h2>On-chain vs Off-chain Responsibilities</h2>
      <table>
        <thead>
          <tr>
            <th>Responsibility</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>JSON parsing</td><td>off-chain</td></tr>
          <tr><td>schema construction</td><td>off-chain</td></tr>
          <tr><td>signing</td><td>off-chain</td></tr>
          <tr><td>verification</td><td>on-chain</td></tr>
          <tr><td>execution</td><td>on-chain</td></tr>
        </tbody>
      </table>

      <hr />

      <h1>Relationship to OpenClaiming JSON</h1>
      <p>The transformation flow is:</p>
      <CodeBlock code={`OCP JSON → (off-chain transform) → EIP712 struct → on-chain verify`} language="text" />
      <p><strong>JSON never reaches the blockchain.</strong></p>
      <p>All schema resolution, identifier parsing, and claim transformation happens off-chain before submission to contracts.</p>

      <hr />

      <h1>Domain Separation</h1>
      <p>
        EIP-712 requires a domain separator to prevent cross-contract replay attacks.
        OpenClaiming uses fixed, deterministic domain parameters.
      </p>

      <h2>Domain Parameters</h2>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>name</code></td>
            <td>"OpenClaiming.payments" or "OpenClaiming.authorizations"</td>
          </tr>
          <tr>
            <td><code>version</code></td>
            <td>"1"</td>
          </tr>
          <tr>
            <td><code>chainId</code></td>
            <td>block.chainid (current chain)</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h1>Canonical Structs</h1>
      <p>Each extension has a fixed canonical struct definition.</p>

      <h2>Payment Struct</h2>
      <CodeBlock
        code={`Payment(
  address payer,
  address token,
  bytes32 recipientsHash,
  uint256 max,
  uint256 line,
  uint256 nbf,
  uint256 exp
)`}
        language="solidity"
      />

      <h2>Authorization Struct</h2>
      <CodeBlock
        code={`Authorization(
  address authority,
  address subject,
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

      <h1>Hashing Rules</h1>
      <p>
        OpenClaiming uses deterministic hashing for all array and struct fields.
      </p>

      <h2>Arrays</h2>
      <p>Arrays are hashed by packing individual element hashes:</p>
      <CodeBlock code={`keccak256(abi.encodePacked(values))`} language="solidity" />

      <h2>Nested Structs</h2>
      <p>Each struct is hashed individually, then packed and hashed again:</p>
      <CodeBlock
        code={`// hash each → pack → hash
bytes32 hash1 = hashStruct(item1);
bytes32 hash2 = hashStruct(item2);
bytes32 finalHash = keccak256(abi.encodePacked(hash1, hash2));`}
        language="solidity"
      />
      <p><strong>Important:</strong> Array order MUST be preserved. Empty arrays hash deterministically.</p>

      <hr />

      <h1>Signature Model</h1>
      <p>OpenClaiming on EVM uses standard ECDSA signatures:</p>
      <ul>
        <li><strong>Only EOAs sign</strong> — externally owned accounts with private keys</li>
        <li><strong>Uses ecrecover</strong> — standard Ethereum signature recovery</li>
        <li><strong>No ERC-1271 support</strong> — contract signatures not supported (yet)</li>
      </ul>

      <hr />

      <h1>Execution Model</h1>
      <p>Contracts serve as verification and enforcement layers:</p>
      <ul>
        <li><strong>Contracts don't sign</strong> — only EOAs create signatures</li>
        <li><strong>Contracts only verify + enforce</strong> — check signatures and apply business logic</li>
        <li><strong>Execution is optional</strong> — verify-only mode is valid</li>
      </ul>

      <hr />

      <h1>Verification Flow</h1>
      <p>The standard verification flow:</p>
      <ol>
        <li>receive struct + signature</li>
        <li>recompute EIP-712 hash</li>
        <li>recover signer via ecrecover</li>
        <li>validate signer authority</li>
        <li>check expiration and constraints</li>
        <li>execute or revert</li>
      </ol>

      <hr />

      <h1>Determinism</h1>
      <p>The EVM integration is fully deterministic:</p>
      <ul>
        <li><strong>No runtime schema</strong> — struct definitions are fixed at compile time</li>
        <li><strong>No dynamic type construction</strong> — all types are statically defined</li>
        <li><strong>Fully canonical</strong> — identical inputs always produce identical hashes</li>
      </ul>

      <hr />

      <h1>Example Flow</h1>
      <p>Complete workflow from JSON to execution:</p>
      <ol>
        <li><strong>Build JSON</strong> — construct OpenClaim with payment or authorization data</li>
        <li><strong>Convert to struct</strong> — transform JSON fields into Solidity struct</li>
        <li><strong>Hash</strong> — compute EIP-712 digest</li>
        <li><strong>Sign</strong> — EOA signs the digest with private key</li>
        <li><strong>Submit</strong> — send struct + signature to contract</li>
        <li><strong>Execute</strong> — contract verifies and executes logic</li>
      </ol>

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
        <li>clean separation between off-chain JSON and on-chain structs</li>
        <li>canonical EIP-712 encoding</li>
        <li>deterministic verification</li>
        <li>efficient on-chain execution</li>
      </ul>
    </DocLayout>
  );
}