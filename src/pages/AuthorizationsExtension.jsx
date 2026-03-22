import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function AuthorizationsExtension() {
  return (
    <DocLayout title="Authorizations Extension">
      <p className="lead text-lg text-gray-500 !mt-0">
        The authorizations extension defines standardized permission claims that grant one or more actors the ability to perform specific actions on a specific subject, optionally under constraints and within defined contexts.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>
        Unlike the freeform <code>stm</code> field, this extension exists to normalize common authorization patterns so they can be interpreted consistently across systems.
      </p>

      <p>Authorizations can be used for:</p>
      <ul>
        <li>role assignment</li>
        <li>permission grants</li>
        <li>delegated control</li>
        <li>workflow approvals</li>
        <li>gated access to contracts, communities, APIs, or application resources</li>
      </ul>

      <p>These claims are designed to work both:</p>
      <ul>
        <li>off-chain (application logic, Qbix systems)</li>
        <li>on-chain (EVM smart contracts via EIP-712 verification)</li>
      </ul>

      <hr />

      <h1>Structure</h1>
      <CodeBlock code={`"authorizations": [ claims ]`} language="json" />
      <p>Each entry in the array is a full OpenClaim.</p>

      <hr />

      <h1>Claim Shape</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "authority identifier",
  "sub": "authorized subject",
  "stm": {
    "actors": ["actor identifier", "..."],
    "roles": ["role name", "..."],
    "actions": ["action name", "..."],
    "constraints": [
      {
        "key": "constraintName",
        "op": "eq",
        "value": "..."
      }
    ],
    "contexts": [
      {
        "type": "contextType",
        "value": "..."
      }
    ]
  },
  "key": ...,
  "sig": ["BASE64_SIGNATURE", ...]
}`}
        language="json"
      />

      <hr />

      <h1>Field Semantics</h1>

      <h2>iss (Authority)</h2>
      <p>The issuer of the claim. This is the authority granting permission.</p>
      <p>Examples:</p>
      <CodeBlock
        code={`"iss": "evm:53:address:0x...authority"
"iss": "qbix:community:SomeCommunity"`}
        language="json"
      />

      <h2>sub (Subject)</h2>
      <p>
        The resource or object being authorized.
        This is <strong>not a token</strong> (unless the authorization is about a token).
        It represents what is being controlled.
      </p>
      <p>Examples:</p>
      <CodeBlock
        code={`"sub": "evm:53:address:0x...communityContract"
"sub": "evm:53:address:0x...controlContract"
"sub": "qbix:community:SomeCommunity"
"sub": "qbix:stream:publisherId/streamName"`}
        language="json"
      />

      <h2>actors</h2>
      <p>Identifies who is allowed to act under this authorization.</p>
      <p>Examples:</p>
      <CodeBlock
        code={`"actors": ["evm:53:address:0x...user"]
"actors": ["qbix:user:someUserId"]`}
        language="json"
      />

      <h2>roles</h2>
      <p>Defines roles associated with the authorization.</p>
      <p>These may represent:</p>
      <ul>
        <li>roles being granted</li>
        <li>roles required</li>
        <li>roles referenced by downstream systems</li>
      </ul>
      <p>Examples:</p>
      <CodeBlock code={`"roles": ["admins", "moderators"]`} language="json" />

      <h2>actions</h2>
      <p>Defines what operations are allowed.</p>
      <p>Examples:</p>
      <CodeBlock code={`"actions": ["grantRoles", "revokeRoles", "invoke", "execute"]`} language="json" />
      <p>These map naturally to contract operations and application actions.</p>

      <h2>constraints</h2>
      <p>Optional restrictions that limit the authorization.</p>
      <CodeBlock
        code={`"constraints": [
  { "key": "maxAddresses", "op": "eq", "value": "100" },
  { "key": "duration", "op": "eq", "value": "2592000" }
]`}
        language="json"
      />
      <p>Examples include:</p>
      <ul>
        <li>maximum limits</li>
        <li>time durations</li>
        <li>thresholds</li>
        <li>object-specific restrictions</li>
      </ul>

      <h2>contexts</h2>
      <p>Optional scoping of where or how the authorization applies.</p>
      <CodeBlock
        code={`"contexts": [
  { "type": "contract", "value": "Community" },
  { "type": "app", "value": "Groups" }
]`}
        language="json"
      />
      <p>Used for:</p>
      <ul>
        <li>application scoping</li>
        <li>workflow scoping</li>
        <li>multi-environment systems</li>
      </ul>

      <hr />

      <h1>Examples</h1>

      <h2>Example 1 — Community Role Management (EVM)</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "evm:53:address:0x...authority",
  "sub": "evm:53:address:0x...communityContract",
  "stm": {
    "actors": ["evm:53:address:0x...operator"],
    "roles": ["admins", "members"],
    "actions": ["grantRoles", "revokeRoles"],
    "constraints": [
      { "key": "maxAddresses", "op": "eq", "value": "100" },
      { "key": "duration", "op": "eq", "value": "2592000" }
    ],
    "contexts": [
      { "type": "contract", "value": "Community" }
    ]
  },
  "key": ...,
  "sig": ["BASE64_SIGNATURE"]
}`}
        language="json"
      />
      <p>This authorizes an operator to manage roles within a community contract, subject to limits.</p>

      <h2>Example 2 — Control Workflow Authorization</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "evm:53:address:0x...authority",
  "sub": "evm:53:address:0x...controlContract",
  "stm": {
    "actors": ["evm:53:address:0x...delegate"],
    "actions": ["invoke", "endorse", "execute"],
    "constraints": [
      { "key": "minimumDelay", "op": "eq", "value": "3600" }
    ],
    "contexts": [
      { "type": "group", "value": "currentGroup" }
    ]
  },
  "key": ...,
  "sig": ["BASE64_SIGNATURE"]
}`}
        language="json"
      />
      <p>This authorizes participation in a multi-step execution workflow.</p>

      <h2>Example 3 — Qbix Resource Authorization</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "iss": "qbix:community:SomeCommunity",
  "sub": "qbix:stream:SomePublisherId/SomeStream",
  "stm": {
    "actors": ["qbix:user:someUserId"],
    "roles": ["moderators"],
    "actions": ["read", "write", "relate"],
    "constraints": [
      { "key": "maxRelations", "op": "eq", "value": "50" }
    ],
    "contexts": [
      { "type": "app", "value": "Groups" }
    ]
  },
  "key": ...,
  "sig": ["BASE64_SIGNATURE"]
}`}
        language="json"
      />

      <hr />

      <h1>Canonical Defaults</h1>
      <p>For deterministic processing, omitted fields are treated as:</p>
      <CodeBlock
        code={`actors: []
roles: []
actions: []
constraints: []
contexts: []
nbf: 0
exp: 0`}
        language="json"
      />
      <p>This ensures consistent hashing and EIP-712 compatibility.</p>

      <hr />

      <h1>Canonical EIP-712 Mapping</h1>
      <p>
        Authorizations are designed to map deterministically into EIP-712.
        For complete EVM-compatible encoding and EIP-712 details, see <a href="/EVMBlockchains">EVM Blockchains</a>.
      </p>

      <h2>Domain (inferred)</h2>
      <ul>
        <li>name = <code>"OpenClaiming.authorizations"</code></li>
        <li>version = <code>"1"</code></li>
        <li>chainId = extracted from <code>iss</code></li>
      </ul>

      <h2>Canonical Struct</h2>
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
      <p><strong>Important:</strong> All arrays are hashed. Contracts verify hashes, not raw arrays.</p>

      <h2>Nested Types</h2>
      <CodeBlock
        code={`Constraint(string key,string op,string value)
Context(string type,string value)`}
        language="solidity"
      />

      <h2>Hash-based Integrity</h2>
      <p>All arrays are stored as hashes in the canonical struct:</p>
      <CodeBlock
        code={`actorsHash = keccak256(...)
rolesHash = keccak256(...)
actionsHash = keccak256(...)
constraintsHash = keccak256(...)
contextsHash = keccak256(...)`}
        language="solidity"
      />

      <h2>verifyAuthorizationWithData</h2>
      <p>Optional function that allows passing full arrays:</p>
      <ul>
        <li>accepts full arrays as parameters</li>
        <li>contract recomputes hash</li>
        <li>checks integrity against claim hash</li>
      </ul>

      <h2>Hashing Rules</h2>
      <ul>
        <li>arrays must be ordered</li>
        <li>strings hashed via keccak256(bytes(...))</li>
        <li>nested objects hashed individually before packing</li>
        <li>empty arrays must hash deterministically</li>
      </ul>

      <hr />

      <h1>Contract Interoperability</h1>
      <p>This extension is designed to map cleanly to existing contract systems:</p>
      <ul>
        <li>role-based systems (community contracts)</li>
        <li>multi-step control systems (invoke / endorse / execute)</li>
        <li>permission gating logic</li>
      </ul>
      <p>
        These patterns are already reflected in deployed contract architectures and should be supported by verifier contracts and libraries.
      </p>

      <hr />

      <h1>Execution Model</h1>
      <p>An authorization claim may be:</p>
      <ul>
        <li>verified off-chain and enforced in application logic</li>
        <li>submitted to a smart contract for validation</li>
        <li>used as input to governance or workflow systems</li>
      </ul>

      <p>Verification checks include:</p>
      <ul>
        <li>signature validity</li>
        <li>issuer authority</li>
        <li>expiration constraints</li>
        <li>action and constraint matching</li>
      </ul>

      <hr />

      <h1>Design Notes</h1>
      <ul>
        <li><code>stm</code> remains freeform in general OpenClaiming</li>
        <li>this extension standardizes authorization semantics</li>
        <li>canonical structure enables deterministic EIP-712 encoding</li>
        <li>optional fields allow flexible expressiveness</li>
        <li>defaults ensure stable hashing</li>
      </ul>

      <hr />

      <h1>Summary</h1>
      <p>The authorizations extension transforms OpenClaiming from:</p>
      <ul>
        <li>simple signed statements</li>
      </ul>
      <p>into:</p>
      <ul>
        <li>a portable, composable permission system</li>
      </ul>
      <p>that works across:</p>
      <ul>
        <li>blockchains</li>
        <li>applications</li>
        <li>decentralized systems</li>
        <li>community platforms</li>
      </ul>
    </DocLayout>
  );
}