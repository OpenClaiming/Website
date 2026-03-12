import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function Comparison() {
  return (
    <DocLayout title="OpenClaiming vs Other Standards">
      <p className="lead text-lg text-gray-500 !mt-0">
        OpenClaiming introduces a minimal primitive for verifiable statements. Many existing systems solve similar problems.
        This document explains how OpenClaiming relates to them and why the protocol exists.
      </p>
      <p>OpenClaiming does <strong>not attempt to replace these systems</strong>. Instead, it provides a simpler building block that can complement them.</p>

      <hr />

      <h1>Verifiable Credentials (VC)</h1>
      <p>Verifiable Credentials are a W3C standard for digitally signed credentials such as diplomas, licenses, or certificates.</p>

      <table>
        <thead>
          <tr><th>Feature</th><th>Verifiable Credentials</th><th>OpenClaim</th></tr>
        </thead>
        <tbody>
          <tr><td>Schema complexity</td><td>high</td><td>minimal</td></tr>
          <tr><td>Required infrastructure</td><td>large</td><td>small</td></tr>
          <tr><td>Intended scope</td><td>credential ecosystem</td><td>signed statements</td></tr>
          <tr><td>Implementation difficulty</td><td>moderate–high</td><td>low</td></tr>
        </tbody>
      </table>

      <p>OpenClaiming can be used as a <strong>lightweight credential format</strong> or as a building block inside VC systems. VC systems may embed OpenClaims as evidence.</p>

      <hr />

      <h1>Decentralized Identifiers (DID)</h1>
      <p>Decentralized Identifiers define a mechanism for resolving decentralized identity documents.</p>

      <table>
        <thead>
          <tr><th>Feature</th><th>DID</th><th>OpenClaim</th></tr>
        </thead>
        <tbody>
          <tr><td>Identity resolution</td><td>primary focus</td><td>not defined</td></tr>
          <tr><td>Data model</td><td>identity document</td><td>signed claim</td></tr>
          <tr><td>Infrastructure</td><td>DID methods</td><td>none required</td></tr>
        </tbody>
      </table>

      <p>DIDs identify entities. OpenClaims express <strong>statements about those entities</strong>. They work well together.</p>

      <hr />

      <h1>JSON Web Tokens (JWT)</h1>
      <p>JWT is a widely used format for signed tokens.</p>

      <table>
        <thead>
          <tr><th>Feature</th><th>JWT</th><th>OpenClaim</th></tr>
        </thead>
        <tbody>
          <tr><td>Encoding</td><td>base64 envelope</td><td>plain JSON</td></tr>
          <tr><td>Primary use</td><td>authentication tokens</td><td>general claims</td></tr>
          <tr><td>Canonicalization</td><td>implicit</td><td>RFC 8785</td></tr>
          <tr><td>Human readability</td><td>limited</td><td>high</td></tr>
        </tbody>
      </table>

      <p>JWT is optimized for <strong>transport tokens</strong>. OpenClaiming focuses on <strong>persistent verifiable claims</strong>.</p>

      <hr />

      <h1>DNSSEC</h1>

      <table>
        <thead>
          <tr><th>Feature</th><th>DNSSEC</th><th>OpenClaim</th></tr>
        </thead>
        <tbody>
          <tr><td>Scope</td><td>DNS records</td><td>arbitrary claims</td></tr>
          <tr><td>Trust model</td><td>hierarchical root</td><td>decentralized</td></tr>
          <tr><td>Data flexibility</td><td>limited</td><td>flexible JSON</td></tr>
        </tbody>
      </table>

      <p>OpenClaiming generalizes the idea of <strong>signed records</strong> beyond DNS. Domains may use DNSSEC identities to sign OpenClaims.</p>

      <hr />

      <h1>HTTPS Public Key Infrastructure</h1>

      <table>
        <thead>
          <tr><th>Feature</th><th>HTTPS PKI</th><th>OpenClaim</th></tr>
        </thead>
        <tbody>
          <tr><td>Purpose</td><td>secure transport</td><td>signed statements</td></tr>
          <tr><td>Trust model</td><td>certificate authorities</td><td>verifier-defined</td></tr>
          <tr><td>Data model</td><td>certificates</td><td>JSON claims</td></tr>
        </tbody>
      </table>

      <hr />

      <h1>Certificate Transparency</h1>

      <table>
        <thead>
          <tr><th>Feature</th><th>Certificate Transparency</th><th>OpenClaim</th></tr>
        </thead>
        <tbody>
          <tr><td>Purpose</td><td>monitor certificates</td><td>publish claims</td></tr>
          <tr><td>Data structure</td><td>Merkle logs</td><td>JSON documents</td></tr>
          <tr><td>Scope</td><td>TLS ecosystem</td><td>general statements</td></tr>
        </tbody>
      </table>

      <p>OpenClaims may be <strong>anchored in transparency logs</strong> to provide auditability.</p>

      <hr />

      <h1>Blockchain Attestations</h1>

      <table>
        <thead>
          <tr><th>Feature</th><th>Blockchain</th><th>OpenClaim</th></tr>
        </thead>
        <tbody>
          <tr><td>Storage</td><td>on-chain</td><td>off-chain</td></tr>
          <tr><td>Cost</td><td>high</td><td>minimal</td></tr>
          <tr><td>Purpose</td><td>consensus system</td><td>statement format</td></tr>
        </tbody>
      </table>

      <p>OpenClaims may be anchored to blockchains by storing claim hashes, signatures, and timestamps. This combines blockchain immutability with lightweight claims.</p>

      <hr />

      <h1>Why OpenClaiming Exists</h1>
      <p>OpenClaiming focuses on a simple goal:</p>
      <CodeBlock code={`make signed statements easy to create and verify`} language="text" />
      <p>Many existing standards require substantial infrastructure. OpenClaiming attempts to reduce the problem to a minimal primitive that can be reused across systems.</p>

      <hr />

      <h1>Design Tradeoffs</h1>
      <p>The protocol intentionally avoids mandatory registries, complex schema definitions, global identity resolution, and centralized trust authorities.</p>
      <p>Instead, it provides a simple cryptographic format that applications can interpret as needed.</p>

      <hr />

      <h1>Complementary, Not Competitive</h1>
      <p>OpenClaiming is not intended to replace existing standards. Instead, it complements them.</p>
      <CodeBlock code={`DID → identity
OpenClaim → signed statement
Blockchain → timestamp anchoring`} language="text" />
      <p>Each layer solves a different problem.</p>

      <hr />

      <h1>Summary</h1>
      <p>OpenClaiming provides a minimal primitive for verifiable statements.</p>
      <CodeBlock code={`issuer signs statement about subject`} language="text" />
      <p>Because the protocol is simple and decentralized, it can be used across many systems while remaining easy to implement.</p>
    </DocLayout>
  );
}