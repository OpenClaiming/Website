import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function PaymentsExtension() {
  return (
    <DocLayout title="Payments Extension">
      <p className="lead text-lg text-gray-500 !mt-0">
        The payments extension defines a standardized way to express spending authorizations.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>
        A payment claim allows a recipient (or set of recipients) to redeem value from a payer, up to a specified maximum amount.
      </p>
      <p>These claims can be:</p>
      <ul>
        <li>Submitted to smart contracts on blockchains</li>
        <li>Processed by off-chain systems (e.g. Qbix communities)</li>
      </ul>
      <p>
        The signed claim itself acts as authorization, removing the need for separate approval transactions.
      </p>

      <hr />

      <h1>Structure</h1>
      <CodeBlock
        code={`"payments": [ /* array of payment claims */ ]`}
        language="json"
      />

      <hr />

      <h1>Field Semantics</h1>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>iss</code></td>
            <td>payer (who is authorizing the payment)</td>
          </tr>
          <tr>
            <td><code>sub</code></td>
            <td>asset/token being transferred</td>
          </tr>
          <tr>
            <td><code>stm.recipients</code></td>
            <td>array of allowed recipients</td>
          </tr>
          <tr>
            <td><code>stm.max</code></td>
            <td>maximum amount authorized</td>
          </tr>
          <tr>
            <td><code>stm.line</code></td>
            <td>trustline / replay protection identifier</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h1>EVM Example</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "evm:53:address:0x...payer",
  "sub": "evm:53:address:0x...token",
  "stm": {
    "recipients": ["evm:53:address:0x...recipient"],
    "max": "3000000",
    "line": 7
  },
  "key": {
    "typ": "ES256",
    "crv": "P-256",
    "x": "BASE64_X",
    "y": "BASE64_Y"
  },
  "sig": ["BASE64_SIGNATURE"]
}`}
        language="json"
      />

      <hr />

      <h1>Qbix Example</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "qbix:community:SomeCommunity",
  "sub": "qbix:token:SomeCommunity",
  "stm": {
    "recipients": ["qbix:user:someUserId"],
    "max": "3000000",
    "line": 7
  },
  "key": "https://community.example/.well-known/openclaiming.json#payerKey",
  "sig": ["BASE64_SIGNATURE"]
}`}
        language="json"
      />

      <hr />

      <h1>Execution</h1>
      <p>A payment claim can be submitted to a blockchain contract or backend system.</p>
      <p>The verifier checks:</p>
      <ul>
        <li>Signature validity</li>
        <li>Expiration constraints</li>
        <li>Trustline constraints (<code>line</code>)</li>
      </ul>
      <p>If valid, the payment may be executed or recorded.</p>

      <hr />

      <h1>Replay Protection</h1>
      <p>
        The <code>line</code> field acts as a trustline identifier or nonce to prevent replay attacks.
        Once a payment is executed, the line may be incremented or invalidated.
      </p>
    </DocLayout>
  );
}