import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function AuthorizationsExtension() {
  return (
    <DocLayout title="Authorizations Extension">
      <p className="lead text-lg text-gray-500 !mt-0">
        The authorizations extension defines roles and permissions.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>
        These claims allow systems to assign capabilities such as:
      </p>
      <ul>
        <li>Access rights</li>
        <li>Roles (e.g. student, admin)</li>
        <li>Permitted actions</li>
      </ul>
      <p>Authorization claims can be enforced across both on-chain and off-chain systems.</p>

      <hr />

      <h1>Structure</h1>
      <CodeBlock
        code={`"authorizations": [ /* array of authorization claims */ ]`}
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
            <td>authority granting the authorization</td>
          </tr>
          <tr>
            <td><code>sub</code></td>
            <td>entity receiving the authorization</td>
          </tr>
          <tr>
            <td><code>stm.roles</code></td>
            <td>array of role identifiers</td>
          </tr>
          <tr>
            <td><code>stm.actions</code></td>
            <td>array of permitted action identifiers</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h1>Example</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "https://university.example",
  "sub": "https://users.example/alice",
  "stm": {
    "roles": ["students"],
    "actions": []
  },
  "nbf": 1712000000,
  "exp": 1750000000,
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

      <h1>Role-Based Access Control</h1>
      <p>
        Authorization claims can be used to implement role-based access control (RBAC) across decentralized systems.
        The issuer defines roles and actions, and verifiers enforce them.
      </p>

      <hr />

      <h1>Time-Bound Authorizations</h1>
      <p>
        Use <code>nbf</code> and <code>exp</code> fields to create temporary authorizations that automatically expire.
      </p>
    </DocLayout>
  );
}