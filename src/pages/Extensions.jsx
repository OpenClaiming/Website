import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function Extensions() {
  return (
    <DocLayout title="Extensions">
      <p className="lead text-lg text-gray-500 !mt-0">
        Extensions provide standardized schemas for common types of claims.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>
        Extensions are top-level fields that define standardized claim formats for common use cases.
        They exist alongside core fields such as <code>nbf</code> and <code>exp</code>, and are not part of <code>stm</code>.
      </p>
      <p>
        While <code>stm</code> remains freeform, extensions ensure interoperability by defining consistent schemas.
      </p>

      <hr />

      <h1>How Extensions Work</h1>
      <p>Extensions are arrays of nested OpenClaim objects. Each entry MUST be a valid OpenClaim.</p>
      <p>Extensions exist as top-level fields alongside core fields such as <code>nbf</code> and <code>exp</code>, and are not part of <code>stm</code>.</p>
      <p>While <code>stm</code> remains freeform, extensions ensure interoperability by defining consistent schemas and execution semantics.</p>

      <hr />

      <h1>Standard Extensions (v1)</h1>
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

      <h1>Extension Structure</h1>
      <p>Each extension is an array of fully valid OpenClaim objects:</p>
      <CodeBlock
        code={`{
  "ocp": 1,
  "payments": [
    {
      "ocp": 1,
      "iss": "evm:56:address:0x111...",
      "sub": "evm:56:token:0x222...",
      "stm": {
        "recipients": [
          "evm:56:address:0x333..."
        ],
        "max": "3000000",
        "line": "7"
      },
      "key": [
        "data:key/es256;base64,MIIB..."
      ],
      "sig": [
        "BASE64_SIGNATURE"
      ]
    }
  ]
}`}
        language="json"
      />

      <h2>Payment Semantics</h2>
      <table>
        <thead>
          <tr><th>Field</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>iss</code></td><td>payer</td></tr>
          <tr><td><code>sub</code></td><td>asset</td></tr>
          <tr><td><code>stm.recipients</code></td><td>allowed recipients</td></tr>
          <tr><td><code>stm.max</code></td><td>maximum cumulative spend</td></tr>
          <tr><td><code>stm.line</code></td><td>trustline identifier</td></tr>
        </tbody>
      </table>

      <hr />

      <h1>Available Extensions</h1>
      <ul>
        <li><strong>Payments</strong> — Spending authorizations for tokens and assets</li>
        <li><strong>Authorizations</strong> — Role and permission grants</li>
      </ul>
      <p>See individual extension pages for detailed specifications and examples.</p>
    </DocLayout>
  );
}