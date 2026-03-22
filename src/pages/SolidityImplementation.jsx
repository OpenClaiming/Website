import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

export default function SolidityImplementation() {
  return (
    <DocLayout title="Solidity Implementation">
      <p className="lead text-lg text-gray-500 !mt-0">
        Reference implementation of OpenClaiming protocol verification in Solidity for EVM-compatible blockchains.
      </p>

      <hr />

      <h1>Overview</h1>
      <p>
        The Solidity implementation demonstrates how to verify OpenClaiming payment claims on-chain,
        enabling decentralized payment authorizations without separate approval transactions.
      </p>

      <hr />

      <h1>ControlContract Architecture</h1>
      <p>
        The <code>ControlContract</code> is an upgradeable smart contract that manages multi-signature operations
        with role-based access control and time-based group transitions.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Multi-group role-based authorization</li>
        <li>Time-based group transitions (30-day timeout)</li>
        <li>Invoke, endorse, and execute workflow</li>
        <li>Support for ERC20, ERC721, ERC777, and ERC1155 tokens</li>
        <li>Integration with Intercoin Community roles</li>
      </ul>

      <hr />

      <h1>Core Workflow</h1>

      <h2>1. Invoke Operation</h2>
      <p>Users with invoke role can propose operations:</p>
      <CodeBlock
        code={`function invoke(
    address contractAddress,
    string memory method,
    string memory params,
    uint256 minimum,
    uint256 fraction,
    uint64 delay
) public returns(uint256 invokeID, uint40 invokeIDWei)`}
        language="solidity"
      />

      <h2>2. Endorse Operation</h2>
      <p>Users with endorse role approve operations:</p>
      <CodeBlock
        code={`function endorse(uint256 invokeID) public`}
        language="solidity"
      />

      <h2>3. Execute Operation</h2>
      <p>Once approved, operations are executed:</p>
      <CodeBlock
        code={`function execute(uint256 invokeID) public`}
        language="solidity"
      />

      <hr />

      <h1>Group Management</h1>
      <p>
        Groups define role-based permissions with automatic transitions based on inactivity.
        After 30 days of inactivity, ownership transfers to the next group.
      </p>

      <CodeBlock
        code={`struct Group {
    uint256 index;
    uint256 lastSeenTime;
    EnumerableSetUpgradeable.UintSet invokeRoles;
    EnumerableSetUpgradeable.UintSet endorseRoles;
    mapping(uint256 => Operation) operations;
    mapping(uint40 => uint256) pairWeiInvokeId;
}`}
        language="solidity"
      />

      <h2>Heartbeat Mechanism</h2>
      <p>
        The <code>heartbeat()</code> function updates group ownership and prevents timeout:
      </p>
      <CodeBlock
        code={`function heartbeat() public`}
        language="solidity"
      />

      <hr />

      <h1>Approval Mechanics</h1>
      <p>
        Operations require endorsements based on configurable thresholds:
      </p>
      <ul>
        <li><code>minimum</code> — Minimum number of endorsements required</li>
        <li><code>fraction</code> — Fraction of group members (e.g., 5e9 = 50%)</li>
      </ul>
      <p>
        The higher of <code>minimum</code> or <code>fraction × memberCount</code> determines approval threshold.
      </p>

      <hr />

      <h1>Payment Claims Integration</h1>
      <p>
        This contract can verify and execute OpenClaiming payment claims by:
      </p>
      <ol>
        <li>Verifying the signature against the payer's public key</li>
        <li>Checking the claim hasn't expired</li>
        <li>Validating the trustline (<code>line</code> field)</li>
        <li>Executing the payment if all checks pass</li>
      </ol>

      <hr />

      <h1>Wei-Based Endorsement</h1>
      <p>
        Users can endorse operations by sending wei amounts matching the <code>invokeIDWei</code>:
      </p>
      <CodeBlock
        code={`receive() external payable {
    heartbeat();
    uint256 invokeID = groups[currentGroupIndex].pairWeiInvokeId[uint40(msg.value)];
    _endorse(invokeID);
}`}
        language="solidity"
      />

      <hr />

      <h1>Security Considerations</h1>
      <ul>
        <li>ReentrancyGuard protection on critical functions</li>
        <li>Role validation via Intercoin Community contract</li>
        <li>Configurable minimum delay between approval and execution</li>
        <li>Per-operation delay configuration</li>
      </ul>

      <hr />

      <h1>Initialization</h1>
      <CodeBlock
        code={`function init(
    address communityAddr,
    GroupRolesSetting[] memory groupRoles,
    uint16 minDelay,
    address costManager,
    address producedBy
) public initializer`}
        language="solidity"
      />

      <p>
        <strong>Parameters:</strong>
      </p>
      <ul>
        <li><code>communityAddr</code> — Intercoin Community contract address</li>
        <li><code>groupRoles</code> — Array of group configurations with invoke/endorse roles</li>
        <li><code>minDelay</code> — Minimum seconds between approval and execution (0 = immediate)</li>
      </ul>

      <hr />

      <h1>Events</h1>
      <CodeBlock
        code={`event OperationInvoked(uint256 indexed invokeID, uint40 invokeIDWei, address contractAddress, string method, string params);
event OperationEndorsed(uint256 indexed invokeID, uint40 invokeIDWei);
event OperationExecuted(uint256 indexed invokeID, uint40 invokeIDWei);
event HeartBeat(uint256 groupIndex, uint256 time);
event CurrentGroupIndexChanged(uint256 from, uint256 to, uint256 time);`}
        language="solidity"
      />

      <hr />

      <h1>License</h1>
      <p>
        This code is proprietary software developed by Intercoin Inc.
        Deployment rights are restricted to official factory contracts.
        See contract header for full license terms.
      </p>
    </DocLayout>
  );
}