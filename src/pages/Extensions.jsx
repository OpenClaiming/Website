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
      <p>Each extension defines:</p>
      <ul>
        <li>A specific structure for <code>stm</code></li>
        <li>Expected semantics</li>
        <li>How the claim is interpreted or executed</li>
      </ul>
      <p>Extensions allow different systems to interoperate without custom parsing logic.</p>

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
      <p>Each extension corresponds to an array of claim objects:</p>
      <CodeBlock
        code={`{
  "ocp": 1,
  "payments": [
    { /* payment claim */ },
    { /* payment claim */ }
  ],
  "authorizations": [
    { /* authorization claim */ }
  ]
}`}
        language="json"
      />

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