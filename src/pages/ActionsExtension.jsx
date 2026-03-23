import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function ActionsExtension() {
  return (
    <DocLayout title="Actions Extension (Invocations)">
      <p className="lead text-lg text-gray-500 !mt-0">
        The actions extension defines standardized execution claims. These claims represent requests to perform
        operations, which may require multisignature approval, role-based authorization, time delays, and
        contract-specific validation.
      </p>
      <p className="text-gray-500">
        Unlike simple statements, actions may result in deferred or conditional execution.
      </p>

      <hr />

      <h1>Structure</h1>
      <CodeBlock code={`"actions": [ claims ]`} language="json" />
      <p>Each entry is a full OpenClaim.</p>

      <hr />

      <h1>Claim Shape</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "authority identifier",
  "sub": "target identifier",
  "stm": {
    "contract": "evm:56:address:0x...",
    "method": "hexMethodSelector",
    "params": "encodedParams",
    "minimum": "1",
    "fraction": "5000000000",
    "delay": "0"
  },
  "key": [...],
  "sig": [...]
}`}
        language="json"
      />

      <hr />

      <h1>Field Semantics</h1>

      <h2>iss (Authority)</h2>
      <p>The entity on whose behalf the action is performed. <strong>NOT necessarily the signer.</strong></p>

      <h2>sub (Target)</h2>
      <p>The subject of the action: a contract, system, workflow, or resource.</p>

      <h2>stm.contract</h2>
      <p>Target contract to call.</p>
      <CodeBlock code={`"contract": "evm:56:address:0x..."`} language="json" />

      <h2>stm.method</h2>
      <p>Hex-encoded function selector (no <code>0x</code> prefix).</p>
      <CodeBlock code={`"method": "a9059cbb"`} language="json" />

      <h2>stm.params</h2>
      <p>Hex-encoded ABI parameters.</p>

      <h2>stm.minimum</h2>
      <p>Minimum number of approvals required.</p>
      <CodeBlock code={`"minimum": "2"`} language="json" />

      <h2>stm.fraction</h2>
      <p>Fraction-based quorum threshold:</p>
      <CodeBlock code={`required = max(minimum, fraction * group_size)`} language="text" />

      <h2>stm.delay</h2>
      <p>Optional delay (in seconds) before execution is permitted.</p>
      <CodeBlock code={`"delay": "3600"`} language="json" />

      <hr />

      <h1>Execution Model</h1>
      <p><strong>An action claim does NOT execute immediately.</strong> It follows a multi-step flow:</p>

      <h2>Step 1 — Invocation</h2>
      <p>The claim is submitted and mapped to <code>invoke()</code>.</p>

      <h2>Step 2 — Endorsement</h2>
      <p>Signers or authorized users approve, mapped to <code>endorse()</code>.</p>

      <h2>Step 3 — Quorum</h2>
      <p>Approvals are counted and must satisfy both:</p>
      <ul>
        <li><code>minimum</code> — absolute floor</li>
        <li><code>fraction</code> — percentage of group size</li>
      </ul>

      <h2>Step 4 — Execution</h2>
      <p>If delay is satisfied: auto-execute or manual <code>execute()</code>.</p>

      <blockquote>
        <strong>Important:</strong> Execution is NOT guaranteed even if signatures are valid.
        Execution depends on quorum rules, contract logic, role permissions, and time delays.
      </blockquote>

      <hr />

      <h1>Signers vs Authority</h1>
      <p>
        The <code>key</code> field defines who can sign.
        The <code>iss</code> field defines who the action is for.
        These are <strong>NOT required to be the same.</strong>
      </p>
      <table>
        <thead>
          <tr><th>Field</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>iss</code></td><td>organization / authority</td></tr>
          <tr><td><code>key[]</code></td><td>board members / signers</td></tr>
        </tbody>
      </table>

      <hr />

      <h1>Multisig Model</h1>
      <ul>
        <li><code>key[]</code> → resolves to signer addresses</li>
        <li><code>sig[]</code> → signatures from those signers</li>
        <li>Quorum enforced by OpenClaim verifier and/or contract logic</li>
      </ul>

      <hr />

      <h1>Example</h1>
      <CodeBlock
        code={`{
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
}`}
        language="json"
      />

      <hr />

      <h1>EIP-712 Mapping</h1>
      <p>Actions map to EIP-712 via a fixed struct:</p>
      <CodeBlock
        code={`Action(
  address authority,
  address subject,
  address contractAddress,
  bytes4 method,
  bytes paramsHash,
  uint256 minimum,
  uint256 fraction,
  uint256 delay,
  uint256 nbf,
  uint256 exp
)`}
        language="solidity"
      />
      <p>EIP-712 canonicalization is extension-specific and MUST NOT be inferred from arbitrary JSON structure.</p>

      <hr />

      <h1>Contract Interoperability</h1>
      <p>This extension maps directly to contracts like:</p>
      <ul>
        <li><strong>ControlContract</strong> — invoke, endorse, execute</li>
        <li><strong>Community contracts</strong> — role checks</li>
        <li><strong>Governance systems</strong></li>
      </ul>

      <hr />

      <h1>Relation to Payments</h1>
      <table>
        <thead>
          <tr><th>Extension</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>payments</code></td><td>financial authorization</td></tr>
          <tr><td><code>actions</code></td><td>arbitrary execution authorization</td></tr>
        </tbody>
      </table>
      <p>Both use the same <code>key</code>/<code>sig</code> model and EIP-712 profile.</p>

      <hr />

      <h1>Design Principle</h1>
      <p>Actions define <strong>authorized intent, not guaranteed execution.</strong></p>

      <hr />

      <h1>Summary</h1>
      <p>The actions extension provides:</p>
      <ul>
        <li>a minimal but expressive execution authorization model</li>
        <li>compatibility with ControlContract-style invoke/endorse/execute flows</li>
        <li>deterministic EIP-712 encoding for on-chain verification</li>
        <li>multisig support via <code>key[]</code>/<code>sig[]</code> arrays</li>
        <li>separation between authority (<code>iss</code>) and signers (<code>key</code>)</li>
      </ul>
    </DocLayout>
  );
}