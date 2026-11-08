import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function DelegationExtension() {
  return (
    <DocLayout title="Delegation Extension">
      <p className="lead text-lg text-gray-500 !mt-0">
        A delegation is a signed statement that an issuer authorizes a delegate to act on its behalf
        within a defined scope. Delegations can be chained: if A delegates to B and B delegates to C,
        a verifier walks the chain from C back to A, checking each link independently.
      </p>
      <p className="text-gray-500">
        Delegations support two binding modes. In key-bound mode, the delegate is identified by the
        hash of their public key, and verification is purely cryptographic — no network lookups needed.
        In domain-bound mode, the delegate is identified by one or more domains, and the verifier
        resolves the delegate's current public key from their <code>.well-known/ocp-keys</code> endpoint
        at verification time.
      </p>

      <hr />

      <h1>Binding Modes</h1>
      <p>A delegation binds to its delegate by key, by domain, or both:</p>

      <h2>Key-bound (<code>secretHash</code>)</h2>
      <p>
        The delegate is identified by the hash of their public key. Verifiers check
        <code>hash(childPublicKey) == secretHash</code>. Used for cryptographic key chains where the
        delegate will sign further claims. Verification requires only public keys — no shared secrets.
      </p>

      <h2>Domain-bound (<code>domains</code>)</h2>
      <p>
        The delegate is identified by one or more domains. Verifiers resolve the delegate's current
        public key from <code>{'https://<domain>/.well-known/ocp-keys'}</code> at verification time.
        Used for publisher and distribution grants where the delegate may rotate keys independently.
      </p>

      <p>
        Both may be present to pin a domain to a specific key. If both are present and disagree (the
        key fetched from the domain doesn't match <code>secretHash</code>), verification fails.
      </p>

      <hr />

      <h1>Statement Fields</h1>

      <h2>Required</h2>
      <table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>parent</code></td><td>string</td><td>Identity of the delegator. For ES256: <code>SHA-256(parentPublicKey)</code> as hex. For EIP712/k256: Ethereum address.</td></tr>
          <tr><td><code>label</code></td><td>string</td><td>Scoping string. Delegations with different labels are independent — a key delegated under one label cannot be used under another.</td></tr>
          <tr><td><code>issuedTime</code></td><td>integer</td><td>Unix timestamp of when the delegation was created.</td></tr>
        </tbody>
      </table>

      <h2>Standard Optional</h2>
      <table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>secretHash</code></td><td>string</td><td>Hash of the delegate's public key. For ES256: <code>SHA-256(childPublicKey)</code> as hex. For EIP712/k256: <code>keccak256(childPublicKey)</code> as hex. Required for key-bound delegations.</td></tr>
          <tr><td><code>domains</code></td><td>array of strings</td><td>Domains that identify the delegate. All listed domains are treated as one delegate (e.g. <code>["publisher.com", "app.publisher.com"]</code>). Required for domain-bound delegations.</td></tr>
          <tr><td><code>context</code></td><td>string</td><td>Freeform string constraining the delegation's scope. Application-defined. Default: <code>""</code>.</td></tr>
          <tr><td><code>limits</code></td><td>array of objects</td><td>Rate limits the delegate must enforce when granting access downstream. Each object has one quantity key (freeform, application-defined) and a <code>per</code> field naming the period. See Rate Limits below.</td></tr>
          <tr><td><code>geo</code></td><td>object</td><td>Geographic restrictions. Contains either <code>includeCountries</code> or <code>excludeCountries</code> (not both). See Geographic Restrictions below.</td></tr>
          <tr><td><code>allowIPs</code></td><td>array of strings</td><td>IP allowlist. If present, requests must originate from a matching IP. Supports CIDR notation and wildcards. See IP Restrictions below.</td></tr>
          <tr><td><code>maxDepth</code></td><td>integer</td><td>Maximum re-delegation depth. <code>0</code> means the delegate cannot re-delegate at all (can only act, not authorize others). <code>1</code> means one level of re-delegation is allowed (e.g. publisher can issue viewer tickets but viewers can't re-delegate). Absent means unlimited depth. See Re-delegation Depth below.</td></tr>
        </tbody>
      </table>
      <p>At least one of <code>secretHash</code> or <code>domains</code> must be present.</p>

      <h2>Application-Defined Fields</h2>
      <p>
        Additional fields may appear in <code>stm</code> beyond the ones listed above. The standard
        fields have defined semantics that verifiers must respect. Application-defined fields are
        opaque to generic verifiers but meaningful to specific implementations.
      </p>

      <hr />

      <h1>Rate Limits</h1>
      <p>
        The <code>limits</code> array contains one or more rate limit objects. Each object has exactly
        one quantity key and a <code>per</code> field:
      </p>
      <CodeBlock
        code={`"limits": [
  { "minutes": 30, "per": "day" },
  { "videos": 5, "per": "day" },
  { "minutes": 200, "per": "month" }
]`}
        language="json"
      />
      <p>
        The quantity key (e.g. <code>minutes</code>, <code>videos</code>) is freeform and
        application-defined. The protocol does not prescribe which quantities exist — applications
        define and enforce their own. Common examples include <code>minutes</code>, <code>videos</code>,
        <code>bytes</code>, <code>requests</code>.
      </p>
      <p>
        The <code>per</code> field is one of: <code>hour</code>, <code>day</code>, <code>week</code>,
        <code>month</code>, <code>year</code>. Periods reset on natural boundaries (midnight UTC for
        <code>day</code>, first of month for <code>month</code>, etc.).
      </p>
      <p>
        When multiple limits are present, all of them apply simultaneously. A request that would
        exceed any single limit is denied.
      </p>
      <p>
        <strong>Limits are global per delegation, not per viewer.</strong> The issuer grants the
        delegate a total budget (e.g. 10,000 minutes/month across all the delegate's users). How the
        delegate subdivides that budget among their own users is the delegate's concern, not the
        protocol's. The verifying server tracks aggregate consumption per delegation per period.
      </p>
      <p>
        Rate limits are declarative constraints. The issuer states the limits; the verifying server
        (e.g. a Safecloud jet) enforces them by tracking total consumption per delegation. Payment for
        the delegated quota is a separate concern — the delegate may receive it for free, pay off-chain
        (invoice, Stripe), or settle on-chain via the OCP Payments extension. The delegation authorizes
        access; it does not prescribe how payment works.
      </p>

      <hr />

      <h1>Geographic Restrictions</h1>
      <p>
        The <code>geo</code> object restricts where the delegation is valid, based on the viewer's IP
        geolocation:
      </p>

      <h2>Exclude Mode</h2>
      <p>Valid everywhere except the listed countries:</p>
      <CodeBlock
        code={`"geo": {
  "excludeCountries": ["KP", "IR", "SY"]
}`}
        language="json"
      />

      <h2>Include Mode</h2>
      <p>Valid only in the listed countries:</p>
      <CodeBlock
        code={`"geo": {
  "includeCountries": ["US", "CA", "GB", "AU"]
}`}
        language="json"
      />

      <p>
        Country codes are ISO 3166-1 alpha-2. Only one of <code>includeCountries</code> or
        <code>excludeCountries</code> should be present. If both are present, <code>includeCountries</code>
        takes precedence.
      </p>
      <p>
        The verifying server determines the viewer's country by IP geolocation and checks it against
        the restriction. If <code>geo</code> is absent, the delegation is valid globally.
      </p>

      <hr />

      <h1>IP Restrictions</h1>
      <p>
        The <code>allowIPs</code> array restricts which source IPs may use this delegation. This is
        useful when the delegate is a server with known IPs (e.g. a publisher's backend), not an end
        user on a dynamic IP.
      </p>
      <p>Entries support three formats:</p>
      <ul>
        <li><strong>Exact</strong>: <code>"203.0.113.5"</code></li>
        <li><strong>CIDR</strong>: <code>"203.0.113.0/24"</code></li>
        <li><strong>Wildcard</strong>: <code>"203.0.113.*"</code>, <code>"10.0.*.*"</code></li>
      </ul>
      <CodeBlock
        code={`"allowIPs": [
  "203.0.113.0/24",
  "198.51.100.5",
  "2001:db8::/32"
]`}
        language="json"
      />
      <p>
        IPv4 and IPv6 are both supported. If <code>allowIPs</code> is absent, no IP restriction applies.
        If present, a request from an IP that doesn't match any entry is denied.
      </p>
      <p>
        <code>allowIPs</code> restricts the delegate's server IP (where signed viewer certs originate
        from). <code>geo</code> restricts the viewer's IP (where playback requests come from). Both can
        be present — they apply independently.
      </p>

      <hr />

      <h1>Re-delegation Depth</h1>
      <p>The <code>maxDepth</code> field limits how many times a delegation can be re-delegated:</p>
      <ul>
        <li><code>0</code> — the delegate can act under this delegation but cannot authorize anyone else. A publisher with <code>maxDepth: 0</code> could use the content themselves but couldn't issue viewer tickets.</li>
        <li><code>1</code> — one level of re-delegation. A publisher can issue viewer tickets, but viewers can't re-delegate further. This is the typical setting for publisher/distribution grants.</li>
        <li><code>2</code> — two levels. A distributor can delegate to regional publishers, who can issue viewer tickets.</li>
        <li>Absent — no depth limit.</li>
      </ul>
      <p>
        When a delegate re-delegates, the child delegation's effective <code>maxDepth</code> is
        <code>parent.maxDepth - 1</code>. A delegate cannot set a <code>maxDepth</code> higher than its
        own remaining depth. A chain that exceeds the depth limit at any link fails verification.
      </p>

      <hr />

      <h1>Scope Narrowing</h1>
      <p>
        Each link in a delegation chain can only narrow the parent's constraints, never widen them.
        Verifiers must enforce this:
      </p>
      <ul>
        <li><strong>Rate limits</strong>: A child's limits must be less than or equal to the parent's for the same quantity and period. A child may add limits the parent didn't have (further restriction) but cannot raise a limit the parent set.</li>
        <li><strong>Geographic restrictions</strong>: A child cannot add countries to an <code>includeCountries</code> list or remove countries from an <code>excludeCountries</code> list. It can further restrict by removing from includes or adding to excludes.</li>
        <li><strong>IP restrictions</strong>: A child's <code>allowIPs</code> must be a subset of the parent's. If the parent has <code>allowIPs</code>, the child cannot remove that restriction or add IPs outside the parent's set.</li>
        <li><strong>Time bounds</strong>: A child's <code>nbf</code> must be <code>&gt;=</code> the parent's, and its <code>exp</code> must be <code>&lt;=</code> the parent's.</li>
        <li><strong>Domains</strong>: A child's <code>domains</code> must be a subset of the parent's.</li>
      </ul>
      <p>If a child delegation violates any of these, the chain fails verification at that link.</p>

      <hr />

      <h1>Referrer Enforcement</h1>
      <p>
        For domain-bound delegations, the verifying server should check the <code>Origin</code> or
        <code>Referer</code> HTTP header of incoming requests against the delegation's <code>domains</code>
        list. This prevents a publisher's embed code from being copied to an unauthorized domain. This
        is an enforcement recommendation, not an additional field — the <code>domains</code> field
        already carries the information needed.
      </p>

      <hr />

      <h1>Time Bounds</h1>
      <p>
        Use OCP's existing top-level <code>nbf</code> (not before) and <code>exp</code> (expiration)
        fields on the delegation claim, not custom fields inside <code>stm</code>. These are standard
        OCP fields with defined semantics.
      </p>

      <hr />

      <h1>ES256 Examples</h1>

      <h2>Key-bound delegation (cryptographic chain)</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "delegations": [{
    "ocp": 1,
    "iss": "alice",
    "sub": "chat.room.42",
    "stm": {
      "parent": "HEX_SHA256_OF_ALICE_PUBKEY",
      "label": "chat.room.42",
      "secretHash": "HEX_SHA256_OF_BOB_PUBKEY",
      "issuedTime": 1731000000,
      "context": ""
    },
    "key": ["data:key/es256;base64,..."],
    "sig": ["BASE64_SIGNATURE"]
  }]
}`}
        language="json"
      />

      <h2>Domain-bound delegation with rate limits and geo restrictions (publisher/distribution)</h2>
      <CodeBlock
        code={`{
  "ocp": 1,
  "delegations": [{
    "ocp": 1,
    "iss": "author-identity",
    "sub": "my-video-catalog",
    "stm": {
      "parent": "HEX_SHA256_OF_AUTHOR_PUBKEY",
      "label": "my-video-catalog",
      "domains": ["publisher.com", "app.publisher.com"],
      "limits": [
        { "minutes": 30, "per": "day" },
        { "videos": 5, "per": "day" },
        { "minutes": 200, "per": "month" }
      ],
      "geo": {
        "excludeCountries": ["KP", "IR"]
      },
      "allowIPs": ["203.0.113.0/24", "198.51.100.5"],
      "issuedTime": 1731000000
    },
    "nbf": 1731000000,
    "exp": 1762536000,
    "key": ["data:key/es256;base64,..."],
    "sig": ["BASE64_SIGNATURE"]
  }]
}`}
        language="json"
      />

      <hr />

      <h1>EIP712 Example</h1>
      <CodeBlock
        code={`{
  "ocp": 1,
  "delegations": [{
    "ocp": 1,
    "fmt": "EIP712",
    "iss": "evm:1:address:0xAlice",
    "sub": "chat.room.42",
    "stm": {
      "parent": "0xALICE_ADDRESS",
      "label": "chat.room.42",
      "secretHash": "0xKECCAK256_OF_BOB_PUBKEY",
      "issuedTime": "1731000000",
      "context": ""
    },
    "key": ["data:key/eip712,evm:1:address:0xAlice"],
    "sig": ["0x..."]
  }]
}`}
        language="json"
      />

      <h2>EIP712 Type Schema</h2>
      <CodeBlock
        code={`Delegation {
  bytes32 parent,
  string label,
  uint64 issuedTime,
  string context,
  bytes32 secretHash
}`}
        language="solidity"
      />
      <p>
        Note: <code>limits</code>, <code>geo</code>, and <code>domains</code> are not part of the
        EIP712 typed struct because EIP712 requires fixed schemas. These fields are available only in
        ES256 format, where <code>stm</code> is freeform JSON. If an EIP712 delegation needs rate limits
        or geo restrictions, enforce them at the application layer using the delegation's <code>label</code>
        or <code>context</code> as a lookup key.
      </p>

      <hr />

      <h1>Chain Verification</h1>
      <p>To verify a delegation chain <code>[link_0, link_1, ..., link_n]</code>:</p>
      <ol>
        <li>For each link, verify the signature against the key(s) in <code>key</code>.</li>
        <li>For key-bound links: confirm <code>link_i.stm.secretHash == hash(childPublicKey_{"{i+1}"})</code>.</li>
        <li>For domain-bound links: fetch the delegate's public key from <code>{'https://<domain>/.well-known/ocp-keys'}</code> and verify that the next link's signature matches that key.</li>
        <li>Check <code>nbf</code>/<code>exp</code> bounds on each link.</li>
        <li>Check <code>geo</code> restrictions on each link that has them.</li>
        <li>The root <code>link_0.stm.parent</code> must match a trusted root identity.</li>
        <li>Rate <code>limits</code> are enforced by the verifying server, which tracks consumption per viewer per delegation.</li>
      </ol>
      <p>
        For backward compatibility: if a verifier has a <code>derivedSecret</code> instead of a
        <code>childPublicKey</code>, it derives the child keypair from the secret and hashes the
        resulting public key. If that doesn't match, it falls back to hashing the <code>derivedSecret</code>
        directly (legacy mode). This ensures old delegation statements still verify.
      </p>

      <hr />

      <h1>Revocation</h1>
      <p>
        Domain-bound delegations may be revocable at the verifying server (e.g. a Safecloud jet). The
        author can revoke a delegation through the server's control panel, and the server immediately
        stops honoring it. If the publisher has registered a webhook, the server sends a revocation
        notice to the publisher's domain.
      </p>
      <p>
        Key-bound delegations without a verifying server are not revocable — they are valid until
        <code>exp</code>. Applications that need revocation for key-bound delegations should use short
        <code>exp</code> windows and re-issue, or use a revocation list published at a well-known URL.
      </p>

      <hr />

      <h1>Notes</h1>
      <ul>
        <li>Key-bound verification requires only public keys — no shared secrets need to be transmitted to verifiers.</li>
        <li>Domain-bound verification allows key rotation without re-signing the delegation — the delegate updates their <code>.well-known/ocp-keys</code> endpoint.</li>
        <li>Rate limit quantity keys are freeform and application-defined. The protocol standardizes the structure (<code>{'{ "<quantity>": <number>, "per": "<period>" }'}</code>) but not the vocabulary of quantities.</li>
        <li>Geographic restrictions are checked by IP geolocation at the verifying server. They are best-effort — VPNs can circumvent them.</li>
        <li>Teasers (e.g. low-resolution video previews) are typically served without any delegation check. They are published alongside the full content with decryption keys in the public metadata.</li>
        <li>Delegations support OCP's standard multisignature mechanism. A delegation's <code>key</code> and <code>sig</code> arrays can hold multiple entries, requiring multiple parties to co-sign (e.g. both an author and their label or manager). The signing threshold is application-defined.</li>
        <li>For domain-bound delegations, the verifying server should check <code>Origin</code>/<code>Referer</code> headers against <code>domains</code> to prevent unauthorized embedding.</li>
      </ul>
    </DocLayout>
  );
}