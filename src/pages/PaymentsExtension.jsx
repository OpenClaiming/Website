import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function PaymentsExtension() {
  return (
    <DocLayout title="Payments Extension">
      <p className="lead text-lg text-gray-500 !mt-0">
        A payment claim is a signed authorization that allows spending from a payer along a specific trustline ("line").
        The claim does not track usage itself — instead, spending is enforced cumulatively on the line.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>Payment claims enable:</p>
      <ul>
        <li>trustline-based spending</li>
        <li>delegated payment authorization</li>
        <li>cross-system settlement</li>
        <li>reusable payment capacity</li>
      </ul>

      <p>These claims can be:</p>
      <ul>
        <li>submitted to smart contracts on blockchains</li>
        <li>processed by off-chain systems (e.g. Qbix communities)</li>
      </ul>

      <p>The signed claim itself acts as authorization, removing the need for separate approval transactions.</p>

      <hr />

      <h1>Structure</h1>
      <CodeBlock code={`"payments": [ claims ]`} language="json" />
      <p>Each entry is a full OpenClaim.</p>

      <hr />

      <h1>Claim Shape</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "payer identifier",
  "sub": "asset identifier",
  "stm": {
    "recipients": ["recipient identifier", "..."],
    "max": "3000000",
    "line": 7
  },
  "key": ...,
  "sig": ["BASE64_SIGNATURE", ...]
}`}
        language="json"
      />

      <hr />

      <h1>Field Semantics</h1>

      <h2>iss (Payer)</h2>
      <p>The entity authorizing the payment.</p>
      <p>Examples:</p>
      <CodeBlock
        code={`"iss": "evm:53:address:0x...payer"
"iss": "qbix:community:SomeCommunity"`}
        language="json"
      />

      <h2>sub (Asset)</h2>
      <p>The asset or token being transferred.</p>
      <p>Examples:</p>
      <CodeBlock
        code={`"sub": "evm:53:address:0x...token"
"sub": "qbix:token:SomeCommunity"`}
        language="json"
      />

      <h2>recipients</h2>
      <p>Array of allowed recipients.</p>
      <CodeBlock code={`"recipients": ["evm:53:address:0x...recipient"]`} language="json" />
      <ul>
        <li>may contain one or many recipients</li>
        <li>order MUST be preserved for deterministic hashing</li>
      </ul>

      <h2>max</h2>
      <p>Maximum total spend allowed on the line.</p>
      <CodeBlock code={`"max": "3000000"`} language="json" />
      <p><strong>Important:</strong> <code>max</code> represents the maximum total spend allowed on the line, evaluated against the line's current spent amount.</p>
      <ul>
        <li>encoded as string in JSON</li>
        <li>interpreted as uint256 in execution layer</li>
      </ul>

      <h2>line</h2>
      <p>Trustline identifier for cumulative spending tracking.</p>
      <CodeBlock code={`"line": 7`} language="json" />
      <ul>
        <li>line = uint256</li>
        <li>line 0 is valid</li>
        <li>lines persist on-chain</li>
      </ul>

      <hr />

      <h1>Examples</h1>

      <h2>Example 1 — EVM Payment</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "evm:53:address:0x...payer",
  "sub": "evm:53:address:0x...token",
  "stm": {
    "recipients": ["evm:53:address:0x...recipient"],
    "max": "3000000",
    "line": "7"
  },
  "key": [
    "data:key/es256;base64,MIIB..."
  ],
  "sig": ["BASE64_SIGNATURE"]
}`}
        language="json"
      />

      <h2>Example 2 — Qbix Payment</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "qbix:community:SomeCommunity",
  "sub": "qbix:token:SomeCommunity",
  "stm": {
    "recipients": ["qbix:user:someUserId"],
    "max": "133.50",
    "line": "7"
  },
  "key": [
    "https://community.example/.well-known/openclaiming.json#payerKey"
  ],
  "sig": ["BASE64_SIGNATURE"]
}`}
        language="json"
      />

      <hr />

      <h1>Lines (Trustlines)</h1>
      <p>Each payment is executed against a line:</p>
      <CodeBlock code={`payer → line → max → spent`} language="text" />

      <h2>Line State</h2>
      <p>Lines are persistent state defined per (address, lineId):</p>
      <ul>
        <li><code>max</code> — maximum capacity</li>
        <li><code>spent</code> — current cumulative spending</li>
        <li><code>open/closed</code> — line status</li>
      </ul>

      <h2>Remaining Capacity</h2>
      <CodeBlock code={`remaining = min(claim.max, line.max) - line.spent`} language="javascript" />

      <h2>Line Lifecycle</h2>
      <h3>Open</h3>
      <CodeBlock code={`lineOpen(account, line, max)`} language="solidity" />

      <h3>Close</h3>
      <CodeBlock code={`lineClose(account, line)`} language="solidity" />

      <h2>Access Control</h2>
      <p>Lines can be managed by:</p>
      <ul>
        <li>account itself</li>
        <li>or account.owner() (for managed accounts)</li>
      </ul>

      <h2>Unlimited Lines</h2>
      <p><code>max = 0</code> → unlimited capacity</p>

      <hr />

      <h1>Delegation</h1>
      <p>Payment claims enable delegated spending:</p>
      <ul>
        <li><strong>ERC20</strong> — uses transferFrom (requires approval)</li>
        <li><strong>native token</strong> — must be sent by payer directly</li>
      </ul>

      <hr />

      <h1>Replay Protection</h1>
      <p>Replay protection is enforced through cumulative spending on each line.</p>
      <p><strong>Claims are reusable</strong> until line capacity is exhausted.</p>

      <hr />

      <h1>Multi-line Execution</h1>
      <p>Multiple claims can combine for larger payments:</p>
      <ul>
        <li>multiple claims can combine</li>
        <li>same payer + token required</li>
        <li>behaves like routing liquidity</li>
      </ul>

      <hr />

      <h1>Canonical Defaults</h1>
      <p>For deterministic processing, omitted fields are treated as:</p>
      <CodeBlock
        code={`nbf: 0
exp: 0
recipients: []`}
        language="json"
      />
      <p>This ensures consistent hashing and EIP-712 compatibility.</p>

      <hr />

      <h1>Canonical EIP-712 Mapping</h1>
      <p>
        Payments are designed to map deterministically into EIP-712 for on-chain verification.
        For complete EVM-compatible encoding and EIP-712 details, see <a href="/EVMBlockchains">EVM Blockchains</a>.
      </p>

      <h2>Domain (inferred)</h2>
      <ul>
        <li>name = <code>"OpenClaiming.payments"</code></li>
        <li>version = <code>"1"</code></li>
        <li>chainId = extracted from <code>iss</code></li>
      </ul>

      <h2>Canonical Struct</h2>
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

      <h2>Hashing Rules</h2>

      <h3>recipientsHash</h3>
      <CodeBlock
        code={`keccak256(
  abi.encodePacked(
    keccak256(bytes(recipient1)),
    keccak256(bytes(recipient2))
  )
)`}
        language="solidity"
      />
      <p>Rules:</p>
      <ul>
        <li>order MUST be preserved</li>
        <li>empty array must hash deterministically</li>
        <li>each element is hashed individually</li>
      </ul>

      <h2>Value Conversion</h2>
      <ul>
        <li><code>iss</code> → parsed as address (payer)</li>
        <li><code>sub</code> → parsed as address (token)</li>
        <li><code>max</code> → uint256</li>
        <li><code>line</code> → uint256</li>
      </ul>

      <hr />

      <h1>Execution Model</h1>
      <p>A payment claim may be:</p>
      <ul>
        <li>submitted to a smart contract</li>
        <li>processed by a backend</li>
        <li>used in a trustline settlement system</li>
      </ul>

      <p>The verifier checks:</p>
      <ul>
        <li>signature validity</li>
        <li>issuer identity</li>
        <li>expiration constraints</li>
        <li>trustline constraints (<code>line</code>)</li>
        <li>recipient inclusion</li>
        <li>maximum amount</li>
      </ul>

      <p>If valid, the payment may be:</p>
      <ul>
        <li>executed (token transfer)</li>
        <li>recorded (ledger update)</li>
        <li>partially consumed (remaining allowance tracked)</li>
      </ul>



      <hr />

      <h1>Design Notes</h1>
      <ul>
        <li>payments are <strong>authorization primitives</strong>, not transactions</li>
        <li>execution is handled by the verifier system</li>
        <li>compatible with:
          <ul>
            <li>EVM contracts</li>
            <li>Qbix trustlines</li>
            <li>hybrid systems</li>
          </ul>
        </li>
        <li>canonical structure enables:
          <ul>
            <li>deterministic EIP-712 hashing</li>
            <li>shared verifier contracts</li>
            <li>cross-system interoperability</li>
          </ul>
        </li>
      </ul>

      <hr />

      <h1>Summary</h1>
      <p>The payments extension provides:</p>
      <ul>
        <li>a minimal but powerful spending authorization model</li>
        <li>compatibility with both on-chain and off-chain systems</li>
        <li>deterministic encoding for smart contract verification</li>
        <li>a foundation for trustline-based economies</li>
      </ul>
    </DocLayout>
  );
}