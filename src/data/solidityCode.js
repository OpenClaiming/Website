export const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
*********************************************
OFFICIAL OPENCLAIMING PROTOCOL IMPLEMENTATION
*********************************************

Although this code is available for viewing on GitHub and here, the general public is NOT given a license to freely deploy smart contracts based on this code, on any blockchains.
To prevent confusion and increase trust in the audited code bases of smart contracts we produce, we intend for there to be only ONE official Factory address on the blockchain producing the corresponding smart contracts, and we are going to point a blockchain domain name at it.
Copyright (c) Intercoin Inc. All rights reserved.

ALLOWED USAGE.
Provided they agree to all the conditions of this Agreement listed below, anyone is welcome to interact with the official Factory Contract at the this address to produce smart contract instances, or to interact with instances produced in this manner by others.
Any user of software powered by this code MUST agree to the following, in order to use it. If you do not agree, refrain from using the software:

DISCLAIMERS AND DISCLOSURES.
Customer expressly recognizes that nearly any software may contain unforeseen bugs or other defects, due to the nature of software development. Moreover, because of the immutable nature of smart contracts, any such defects will persist in the software once it is deployed onto the blockchain. Customer therefore expressly acknowledges that any responsibility to obtain outside audits and analysis of any software produced by Developer rests solely with Customer.
Customer understands and acknowledges that the Software is being delivered as-is, and may contain potential defects. While Developer and its staff and partners have exercised care and best efforts in an attempt to produce solid, working software products, Developer EXPRESSLY DISCLAIMS MAKING ANY GUARANTEES, REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, ABOUT THE FITNESS OF THE SOFTWARE, INCLUDING LACK OF DEFECTS, MERCHANTABILITY OR SUITABILITY FOR A PARTICULAR PURPOSE.
Customer agrees that neither Developer nor any other party has made any representations or warranties, nor has the Customer relied on any representations or warranties, express or implied, including any implied warranty of merchantability or fitness for any particular purpose with respect to the Software. Customer acknowledges that no affirmation of fact or statement (whether written or oral) made by Developer, its representatives, or any other party outside of this Agreement with respect to the Software shall be deemed to create any express or implied warranty on the part of Developer or its representatives.

INDEMNIFICATION.
Customer agrees to indemnify, defend and hold Developer and its officers, directors, employees, agents and contractors harmless from any loss, cost, expense (including attorney's fees and expenses), associated with or related to any demand, claim, liability, damages or cause of action of any kind or character (collectively referred to as "claim"), in any manner arising out of or relating to any third party demand, dispute, mediation, arbitration, litigation, or any violation or breach of any provision of this Agreement by Customer.
NO WARRANTY.
THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY. DEVELOPER SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES FOR BREACH OF THE LIMITED WARRANTY. TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEVELOPER EXPRESSLY DISCLAIMS, AND CUSTOMER EXPRESSLY WAIVES, ALL OTHER WARRANTIES, WHETHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR USE, OR ANY WARRANTY ARISING OUT OF ANY PROPOSAL, SPECIFICATION, OR SAMPLE, AS WELL AS ANY WARRANTIES THAT THE SOFTWARE (OR ANY ELEMENTS THEREOF) WILL ACHIEVE A PARTICULAR RESULT, OR WILL BE UNINTERRUPTED OR ERROR-FREE. THE TERM OF ANY IMPLIED WARRANTIES THAT CANNOT BE DISCLAIMED UNDER APPLICABLE LAW SHALL BE LIMITED TO THE DURATION OF THE FOREGOING EXPRESS WARRANTY PERIOD. SOME STATES DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES AND/OR DO NOT ALLOW LIMITATIONS ON THE AMOUNT OF TIME AN IMPLIED WARRANTY LASTS, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO CUSTOMER. THIS LIMITED WARRANTY GIVES CUSTOMER SPECIFIC LEGAL RIGHTS. CUSTOMER MAY HAVE OTHER RIGHTS WHICH VARY FROM STATE TO STATE.

LIMITATION OF LIABILITY.
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL DEVELOPER BE LIABLE UNDER ANY THEORY OF LIABILITY FOR ANY CONSEQUENTIAL, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE OR EXEMPLARY DAMAGES OF ANY KIND, INCLUDING, WITHOUT LIMITATION, DAMAGES ARISING FROM LOSS OF PROFITS, REVENUE, DATA OR USE, OR FROM INTERRUPTED COMMUNICATIONS OR DAMAGED DATA, OR FROM ANY DEFECT OR ERROR OR IN CONNECTION WITH CUSTOMER'S ACQUISITION OF SUBSTITUTE GOODS OR SERVICES OR MALFUNCTION OF THE SOFTWARE, OR ANY SUCH DAMAGES ARISING FROM BREACH OF CONTRACT OR WARRANTY OR FROM NEGLIGENCE OR STRICT LIABILITY, EVEN IF DEVELOPER OR ANY OTHER PERSON HAS BEEN ADVISED OR SHOULD KNOW OF THE POSSIBILITY OF SUCH DAMAGES, AND NOTWITHSTANDING THE FAILURE OF ANY REMEDY TO ACHIEVE ITS INTENDED PURPOSE. WITHOUT LIMITING THE FOREGOING OR ANY OTHER LIMITATION OF LIABILITY HEREIN, REGARDLESS OF THE FORM OF ACTION, WHETHER FOR BREACH OF CONTRACT, WARRANTY, NEGLIGENCE, STRICT LIABILITY IN TORT OR OTHERWISE, CUSTOMER'S EXCLUSIVE REMEDY AND THE TOTAL LIABILITY OF DEVELOPER OR ANY SUPPLIER OF SERVICES TO DEVELOPER FOR ANY CLAIMS ARISING IN ANY WAY IN CONNECTION WITH OR RELATED TO THIS AGREEMENT, THE SOFTWARE, FOR ANY CAUSE WHATSOEVER, SHALL NOT EXCEED 1,000 USD.

TRADEMARKS.
This Agreement does not grant you any right in any trademark or logo of Developer or its affiliates.

LINK REQUIREMENTS.
Operators of any Websites and Apps which make use of smart contracts based on this code must conspicuously include the following phrase in their website, featuring a clickable link that takes users to intercoin.app:
"Visit https://intercoin.app to launch your own NFTs, DAOs and other Web3 solutions."

STAKING OR SPENDING REQUIREMENTS.
In the future, Developer may begin requiring staking or spending of Intercoin tokens in order to take further actions (such as producing series and minting tokens). Any staking or spending requirements will first be announced on Developer's website (intercoin.org) four weeks in advance. Staking requirements will not apply to any actions already taken before they are put in place.

CUSTOM ARRANGEMENTS.
Reach out to us at intercoin.org if you are looking to obtain Intercoin tokens in bulk, remove link requirements forever, remove staking requirements forever, or get custom work done with your Web3 projects.

ENTIRE AGREEMENT
This Agreement contains the entire agreement and understanding among the parties hereto with respect to the subject matter hereof, and supersedes all prior and contemporaneous agreements, understandings, inducements and conditions, express or implied, oral or written, of any nature whatsoever with respect to the subject matter hereof. The express terms hereof control and supersede any course of performance and/or usage of the trade inconsistent with any of the terms hereof. Provisions from previous Agreements executed between Customer and Developer., which are not expressly dealt with in this Agreement, will remain in effect.

SUCCESSORS AND ASSIGNS
This Agreement shall continue to apply to any successors or assigns of either party, or any corporation or other entity acquiring all or substantially all the assets and business of either party whether by operation of law or otherwise.

ARBITRATION
All disputes related to this agreement shall be governed by and interpreted in accordance with the laws of New York, without regard to principles of conflict of laws. The parties to this agreement will submit all disputes arising under this agreement to arbitration in New York City, New York before a single arbitrator of the American Arbitration Association ("AAA"). The arbitrator shall be selected by application of the rules of the AAA, or by mutual agreement of the parties, except that such arbitrator shall be an attorney admitted to practice law New York. No party to this agreement will challenge the jurisdiction or venue provisions as provided in this section. No party to this agreement will challenge the jurisdiction or venue provisions as provided in this section.
**/

/**
 * @title OpenClaiming
 * @author Intercoin Inc.
 * @notice Canonical EIP-712 verifier and execution layer for the OpenClaiming Protocol v1.
 *
 * @dev Deployed at 0x99996a51cc950d9822D68b83fE1Ad97B32Cd9999 on all supported chains.
 *      This contract is not upgradeable. Immutable deployment.
 */

// ---------- Minimal interfaces ----------

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface IOwnable {
    function owner() external view returns (address);
}

interface IIncomeContract {
    function pay(address recipient, uint256 amount) external;
}

interface IControlContract {
    function invoke(
        address contractAddress,
        string  calldata method,
        string  calldata params,
        uint256 minimum,
        uint256 fraction,
        uint64  delay
    ) external returns (uint256 invokeID, uint40 invokeIDWei);

    function endorse(uint256 invokeID) external;
}

// ---------- Main contract ----------

contract OpenClaiming {

    // ─────────────────────────────────────────────────────────────────────────
    // Errors
    // ─────────────────────────────────────────────────────────────────────────

    error InvalidSignature();
    error InvalidSignatureLength();
    error InvalidSignatureV();
    error InvalidSignatureS();
    error NotYetValid(uint256 nbf);
    error Expired(uint256 exp);
    error UnauthorizedLineOperator(address account, address caller);
    error LineNotOpen(address account, uint256 line);
    error PaymentRecipientsHashMismatch();
    error InvalidRecipient(address recipient);
    error ClaimMaxExceeded(uint256 requested, uint256 available);
    error LineMaxExceeded(uint256 requested, uint256 available);
    error InsufficientCapacity(uint256 requested, uint256 available);
    error PayerMismatch(address expected, address actual);
    error NativeCoinDelegationUnsupported();
    error NativeCoinValueMismatch(uint256 expected, uint256 actual);
    error TransferFailed();
    error InvokerNotInSigners();
    error InvalidSignerCount();
    error ParamsHashMismatch();

    // ─────────────────────────────────────────────────────────────────────────
    // EIP-712 constants
    // ─────────────────────────────────────────────────────────────────────────

    bytes32 public constant VERSION_HASH = keccak256(bytes("1"));

    bytes32 public constant EIP712_DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    bytes32 public constant PAYMENTS_NAME_HASH =
        keccak256(bytes("OpenClaiming.payments"));

    bytes32 public constant PAYMENTS_TYPEHASH =
        keccak256(
            "Payment(address payer,address token,bytes32 recipientsHash,uint256 max,uint256 line,uint256 nbf,uint256 exp)"
        );

    bytes32 public constant ACTIONS_NAME_HASH =
        keccak256(bytes("OpenClaiming.actions"));

    bytes32 public constant ACTIONS_TYPEHASH =
        keccak256(
            "Action(address authority,address subject,address contractAddress,bytes4 method,bytes32 paramsHash,uint256 minimum,uint256 fraction,uint256 delay,uint256 nbf,uint256 exp)"
        );

    uint256 internal constant SECP256K1N_OVER_2 =
        0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0;

    uint256 public constant DEFAULT_LINE = 0;

    // ─────────────────────────────────────────────────────────────────────────
    // Structs
    // ─────────────────────────────────────────────────────────────────────────

    struct Line {
        uint256 max;
        uint256 spent;
        bool    open;
    }

    struct Payment {
        address payer;
        address token;
        bytes32 recipientsHash;
        uint256 max;
        uint256 line;
        uint256 nbf;
        uint256 exp;
    }

    struct Action {
        address authority;
        address subject;
        address contractAddress;
        bytes4  method;
        bytes32 paramsHash;
        uint256 minimum;
        uint256 fraction;
        uint256 delay;
        uint256 nbf;
        uint256 exp;
    }

    struct PreflightResult {
        bool    valid;
        string  extension;
        bytes32 digest;
        uint256 validSigCount;
        bool    notYetValid;
        bool    expired;
        bool    lineOpen;
        bool    capacityOk;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────────────────────

    mapping(address => mapping(uint256 => Line)) public lines;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event LineOpened(address indexed account, uint256 indexed line, uint256 max);
    event LineClosed(address indexed account, uint256 indexed line);
    event PaymentsExecuted(
        address indexed payer,
        address indexed token,
        address indexed recipient,
        uint256 line,
        uint256 amount,
        uint256 newSpent
    );
    event ActionsExecuted(
        address indexed authority,
        address indexed subject,
        address indexed contractAddress,
        bytes4  method,
        uint256 invokeID
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Line management
    // ─────────────────────────────────────────────────────────────────────────

    function lineOpen(address account, uint256 line, uint256 max) external {
        _requireLineOperator(account, msg.sender);
        lines[account][line].max  = max;
        lines[account][line].open = true;
        emit LineOpened(account, line, max);
    }

    function lineClose(address account, uint256 line) external {
        require(line != DEFAULT_LINE, "OpenClaiming: cannot close default line");
        _requireLineOperator(account, msg.sender);
        lines[account][line].open = false;
        emit LineClosed(account, line);
    }

    function lineIsOpen(address account, uint256 line) external view returns (bool) {
        if (line == DEFAULT_LINE) return true;
        return lines[account][line].open;
    }

    function lineAvailable(
        address account,
        uint256 line,
        uint256 claimMax
    ) external view returns (uint256) {
        if (line == DEFAULT_LINE) {
            return claimMax == 0 ? type(uint256).max : claimMax;
        }
        Line storage l = lines[account][line];
        if (!l.open) return 0;
        uint256 claimRemaining = claimMax == 0
            ? type(uint256).max
            : (l.spent >= claimMax ? 0 : claimMax - l.spent);
        uint256 lineRemaining = l.max == 0
            ? type(uint256).max
            : (l.spent >= l.max ? 0 : l.max - l.spent);
        return claimRemaining < lineRemaining ? claimRemaining : lineRemaining;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Signature primitives
    // ─────────────────────────────────────────────────────────────────────────

    function recoverSigner(
        bytes32 digest,
        bytes calldata signature
    ) public pure returns (address signer) {
        if (signature.length != 65) revert InvalidSignatureLength();

        bytes32 r;
        bytes32 s;
        uint8   v;

        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }

        if (uint256(s) > SECP256K1N_OVER_2) revert InvalidSignatureS();
        if (v == 0 || v == 1) v += 27;
        if (v != 27 && v != 28)             revert InvalidSignatureV();

        signer = ecrecover(digest, v, r, s);
        if (signer == address(0)) revert InvalidSignature();
    }

    function verify(
        bytes32 digest,
        bytes calldata signature,
        address expectedSigner
    ) public pure returns (bool) {
        return recoverSigner(digest, signature) == expectedSigner;
    }

    function verifySignatures(
        bytes32           digest,
        address[] calldata signers,
        bytes[]   calldata signatures,
        uint256            minValid
    ) public pure returns (bool) {
        if (signers.length != signatures.length) return false;
        if (minValid == 0) return false;

        uint256 valid = 0;

        for (uint256 i = 0; i < signers.length; i++) {
            address signer = signers[i];
            if (signer == address(0))      continue;
            if (signatures[i].length == 0) continue;

            bool dup = false;
            for (uint256 j = 0; j < i; j++) {
                if (signers[j] == signer) { dup = true; break; }
            }
            if (dup) continue;

            try this.recoverSigner(digest, signatures[i]) returns (address recovered) {
                if (recovered == signer) {
                    valid++;
                    if (valid >= minValid) return true;
                }
            } catch {}
        }

        return valid >= minValid;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Pre-flight view
    // ─────────────────────────────────────────────────────────────────────────

    function paymentsPreFlight(
        Payment        calldata p,
        address[] calldata recipients,
        address            recipient,
        uint256            amount,
        address[] calldata signers,
        bytes[]   calldata signatures,
        uint256            minValid
    ) external view returns (PreflightResult memory result) {
        result.extension   = "payments";
        result.digest      = paymentsDigest(p);
        result.notYetValid = (p.nbf != 0 && block.timestamp < p.nbf);
        result.expired     = (p.exp != 0 && block.timestamp > p.exp);
        result.lineOpen = (p.line == DEFAULT_LINE) ? true : lines[p.payer][p.line].open;

        if (result.lineOpen) {
            uint256 available;
            if (p.line == DEFAULT_LINE) {
                available = p.max == 0 ? type(uint256).max : p.max;
            } else {
                Line storage l = lines[p.payer][p.line];
                uint256 claimRemaining = p.max == 0
                    ? type(uint256).max
                    : (l.spent >= p.max ? 0 : p.max - l.spent);
                uint256 lineRemaining = l.max == 0
                    ? type(uint256).max
                    : (l.spent >= l.max ? 0 : l.max - l.spent);
                available = claimRemaining < lineRemaining ? claimRemaining : lineRemaining;
            }
            result.capacityOk = (available >= amount);
        }

        uint256 valid = 0;
        for (uint256 i = 0; i < signers.length; i++) {
            if (signers[i] == address(0) || signatures[i].length == 0) continue;
            bool dup = false;
            for (uint256 j = 0; j < i; j++) {
                if (signers[j] == signers[i]) { dup = true; break; }
            }
            if (dup) continue;
            try this.recoverSigner(result.digest, signatures[i]) returns (address recovered) {
                if (recovered == signers[i]) valid++;
            } catch {}
        }
        result.validSigCount = valid;

        bool recipientOk = false;
        if (paymentsHashRecipients(recipients) == p.recipientsHash) {
            for (uint256 i = 0; i < recipients.length; i++) {
                if (recipients[i] == recipient) { recipientOk = true; break; }
            }
        }

        result.valid = (
            !result.notYetValid &&
            !result.expired     &&
            result.lineOpen     &&
            result.capacityOk   &&
            recipientOk         &&
            valid >= minValid
        );
    }

    function actionsPreFlight(
        Action         calldata a,
        bytes          calldata params,
        address[] calldata signers,
        bytes[]   calldata signatures,
        uint256            minValid,
        address            invoker
    ) external view returns (PreflightResult memory result) {
        result.extension   = "actions";
        result.digest      = actionsDigest(a);
        result.notYetValid = (a.nbf != 0 && block.timestamp < a.nbf);
        result.expired     = (a.exp != 0 && block.timestamp > a.exp);
        result.lineOpen   = false;
        result.capacityOk = false;

        bool paramsOk    = (keccak256(params) == a.paramsHash);
        bool invokerFound = false;

        uint256 valid = 0;
        for (uint256 i = 0; i < signers.length; i++) {
            if (signers[i] == address(0) || signatures[i].length == 0) continue;
            bool dup = false;
            for (uint256 j = 0; j < i; j++) {
                if (signers[j] == signers[i]) { dup = true; break; }
            }
            if (dup) continue;
            try this.recoverSigner(result.digest, signatures[i]) returns (address recovered) {
                if (recovered == signers[i]) {
                    valid++;
                    if (signers[i] == invoker) invokerFound = true;
                }
            } catch {}
        }
        result.validSigCount = valid;

        result.valid = (
            !result.notYetValid &&
            !result.expired     &&
            paramsOk            &&
            invokerFound        &&
            valid >= minValid
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // payments — EIP-712 hash helpers
    // ─────────────────────────────────────────────────────────────────────────

    function paymentsDomainSeparator() public view returns (bytes32) {
        return keccak256(abi.encode(
            EIP712_DOMAIN_TYPEHASH,
            PAYMENTS_NAME_HASH,
            VERSION_HASH,
            block.chainid,
            address(this)
        ));
    }

    function paymentsHashRecipients(
        address[] calldata recipients
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(recipients));
    }

    function paymentsHash(Payment calldata p) public pure returns (bytes32) {
        return keccak256(abi.encode(
            PAYMENTS_TYPEHASH,
            p.payer,
            p.token,
            p.recipientsHash,
            p.max,
            p.line,
            p.nbf,
            p.exp
        ));
    }

    function paymentsDigest(Payment calldata p) public view returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\\x19\\x01",
            paymentsDomainSeparator(),
            paymentsHash(p)
        ));
    }

    function paymentsRecoverSigner(
        Payment calldata p,
        bytes   calldata sig
    ) public view returns (address) {
        return recoverSigner(paymentsDigest(p), sig);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // payments — verify & execute
    // ─────────────────────────────────────────────────────────────────────────

    function paymentsVerify(
        Payment        calldata p,
        address[] calldata recipients,
        bytes     calldata sig,
        address            recipient,
        uint256            amount
    ) public view returns (bool) {
        _paymentsValidate(p, recipients, sig, recipient, amount);
        return true;
    }

    function paymentsVerifySignatures(
        Payment        calldata p,
        address[] calldata recipients,
        address            recipient,
        uint256            amount,
        address[] calldata signers,
        bytes[]   calldata signatures,
        uint256            minValid
    ) public view returns (bool) {
        _paymentsValidateCore(p, recipients, recipient, amount);
        return verifySignatures(paymentsDigest(p), signers, signatures, minValid);
    }

    function paymentsExecute(
        Payment        calldata p,
        address[] calldata recipients,
        bytes     calldata sig,
        address            recipient,
        uint256            amount,
        address            incomeContract
    ) public payable returns (bool) {
        _paymentsValidate(p, recipients, sig, recipient, amount);
        _paymentsTransfer(p, recipient, amount, incomeContract);
        return true;
    }

    function paymentsExecuteSignatures(
        Payment        calldata p,
        address[] calldata recipients,
        address            recipient,
        uint256            amount,
        address[] calldata signers,
        bytes[]   calldata signatures,
        uint256            minValid,
        address            incomeContract
    ) public payable returns (bool) {
        _paymentsValidateCore(p, recipients, recipient, amount);
        if (!verifySignatures(paymentsDigest(p), signers, signatures, minValid)) {
            revert InvalidSignature();
        }
        _paymentsTransfer(p, recipient, amount, incomeContract);
        return true;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // actions — EIP-712 hash helpers
    // ─────────────────────────────────────────────────────────────────────────

    function actionsDomainSeparator() public view returns (bytes32) {
        return keccak256(abi.encode(
            EIP712_DOMAIN_TYPEHASH,
            ACTIONS_NAME_HASH,
            VERSION_HASH,
            block.chainid,
            address(this)
        ));
    }

    function actionsHashParams(bytes calldata params) public pure returns (bytes32) {
        return keccak256(params);
    }

    function actionsHash(Action calldata a) public pure returns (bytes32) {
        return keccak256(abi.encode(
            ACTIONS_TYPEHASH,
            a.authority,
            a.subject,
            a.contractAddress,
            a.method,
            a.paramsHash,
            a.minimum,
            a.fraction,
            a.delay,
            a.nbf,
            a.exp
        ));
    }

    function actionsDigest(Action calldata a) public view returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\\x19\\x01",
            actionsDomainSeparator(),
            actionsHash(a)
        ));
    }

    function actionsRecoverSigner(
        Action calldata a,
        bytes  calldata sig
    ) public view returns (address) {
        return recoverSigner(actionsDigest(a), sig);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // actions — verify & execute
    // ─────────────────────────────────────────────────────────────────────────

    function actionsVerify(
        Action calldata a,
        bytes  calldata sig
    ) public view returns (bool) {
        _actionsValidateCore(a);
        address signer = actionsRecoverSigner(a, sig);
        if (signer != a.authority) revert InvalidSignature();
        return true;
    }

    function actionsVerifySignatures(
        Action         calldata a,
        address[] calldata signers,
        bytes[]   calldata signatures,
        uint256            minValid
    ) public view returns (bool) {
        _actionsValidateCore(a);
        return verifySignatures(actionsDigest(a), signers, signatures, minValid);
    }

    function actionsExecute(
        Action         calldata a,
        bytes          calldata params,
        address[] calldata signers,
        bytes[]   calldata signatures,
        uint256            minValid,
        address            invoker
    ) public returns (bool) {
        _actionsValidateCore(a);

        if (keccak256(params) != a.paramsHash) revert ParamsHashMismatch();
        if (signers.length == 0 || signers.length != signatures.length) {
            revert InvalidSignerCount();
        }

        bytes32 digest = actionsDigest(a);
        address[] memory validSigners = new address[](signers.length);
        uint256 validCount = 0;

        for (uint256 i = 0; i < signers.length; i++) {
            address signer = signers[i];
            if (signer == address(0))      continue;
            if (signatures[i].length == 0) continue;

            if (recoverSigner(digest, signatures[i]) != signer) revert InvalidSignature();

            bool dup = false;
            for (uint256 j = 0; j < validCount; j++) {
                if (validSigners[j] == signer) { dup = true; break; }
            }
            if (!dup) {
                validSigners[validCount] = signer;
                validCount++;
            }
        }

        if (validCount < minValid) revert InvalidSignature();

        bool invokerFound = false;
        for (uint256 i = 0; i < validCount; i++) {
            if (validSigners[i] == invoker) { invokerFound = true; break; }
        }
        if (!invokerFound) revert InvokerNotInSigners();

        _forwardCall(
            a.subject,
            abi.encodeWithSelector(
                IControlContract.invoke.selector,
                a.contractAddress,
                _bytes4ToHex(a.method),
                _bytesToHex(params),
                a.minimum,
                a.fraction,
                uint64(a.delay)
            ),
            invoker
        );

        uint256 invokeID = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            invoker
        )));

        bytes memory endorseCall = abi.encodeWithSelector(
            IControlContract.endorse.selector,
            invokeID
        );
        for (uint256 i = 0; i < validCount; i++) {
            _forwardCall(a.subject, endorseCall, validSigners[i]);
        }

        emit ActionsExecuted(
            a.authority,
            a.subject,
            a.contractAddress,
            a.method,
            invokeID
        );

        return true;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal
    // ─────────────────────────────────────────────────────────────────────────

    function _paymentsValidate(
        Payment        calldata p,
        address[] calldata recipients,
        bytes     calldata sig,
        address            recipient,
        uint256            amount
    ) internal view {
        _paymentsValidateCore(p, recipients, recipient, amount);
        address signer = paymentsRecoverSigner(p, sig);
        if (signer != p.payer) revert PayerMismatch(p.payer, signer);
    }

    function _paymentsValidateCore(
        Payment        calldata p,
        address[] calldata recipients,
        address            recipient,
        uint256            amount
    ) internal view {
        if (p.nbf != 0 && block.timestamp < p.nbf) revert NotYetValid(p.nbf);
        if (p.exp != 0 && block.timestamp > p.exp) revert Expired(p.exp);

        if (paymentsHashRecipients(recipients) != p.recipientsHash) {
            revert PaymentRecipientsHashMismatch();
        }

        bool allowed = false;
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == recipient) { allowed = true; break; }
        }
        if (!allowed) revert InvalidRecipient(recipient);

        uint256 claimRemaining;
        uint256 lineRemaining;

        if (p.line == DEFAULT_LINE) {
            uint256 spent = lines[p.payer][DEFAULT_LINE].spent;
            claimRemaining = p.max == 0
                ? type(uint256).max
                : (spent >= p.max ? 0 : p.max - spent);
            lineRemaining = type(uint256).max;
        } else {
            Line storage l = lines[p.payer][p.line];
            if (!l.open) revert LineNotOpen(p.payer, p.line);

            claimRemaining = p.max == 0
                ? type(uint256).max
                : (l.spent >= p.max ? 0 : p.max - l.spent);
            lineRemaining = l.max == 0
                ? type(uint256).max
                : (l.spent >= l.max ? 0 : l.max - l.spent);
        }

        uint256 available = claimRemaining < lineRemaining ? claimRemaining : lineRemaining;

        if (amount > available)      revert InsufficientCapacity(amount, available);
        if (amount > claimRemaining) revert ClaimMaxExceeded(amount, claimRemaining);
        if (amount > lineRemaining)  revert LineMaxExceeded(amount, lineRemaining);
    }

    function _paymentsTransfer(
        Payment calldata p,
        address          recipient,
        uint256          amount,
        address          incomeContract
    ) internal {
        lines[p.payer][p.line].spent += amount;

        if (p.token == address(0)) {
            if (msg.sender != p.payer) revert NativeCoinDelegationUnsupported();
            if (msg.value != amount)   revert NativeCoinValueMismatch(amount, msg.value);
            (bool ok,) = payable(recipient).call{value: amount}("");
            if (!ok) revert TransferFailed();
        } else {
            if (msg.value != 0) revert NativeCoinValueMismatch(0, msg.value);

            if (incomeContract == address(0)) {
                (bool ok, bytes memory data) = p.token.call(
                    abi.encodeWithSelector(
                        IERC20.transferFrom.selector,
                        p.payer,
                        recipient,
                        amount
                    )
                );
                if (!ok || (data.length != 0 && !abi.decode(data, (bool)))) {
                    revert TransferFailed();
                }
            } else {
                _forwardCall(
                    incomeContract,
                    abi.encodeWithSelector(
                        IIncomeContract.pay.selector,
                        recipient,
                        amount
                    ),
                    p.payer
                );
            }
        }

        emit PaymentsExecuted(
            p.payer,
            p.token,
            recipient,
            p.line,
            amount,
            lines[p.payer][p.line].spent
        );
    }

    function _actionsValidateCore(Action calldata a) internal view {
        if (a.nbf != 0 && block.timestamp < a.nbf) revert NotYetValid(a.nbf);
        if (a.exp != 0 && block.timestamp > a.exp) revert Expired(a.exp);
    }

    function _forwardCall(
        address      target,
        bytes memory data,
        address      signer
    ) internal {
        (bool ok,) = target.call(abi.encodePacked(data, signer));
        require(ok, "OpenClaiming: forwarded call failed");
    }

    function _requireLineOperator(address account, address caller) internal view {
        if (caller == account) return;
        try IOwnable(account).owner() returns (address o) {
            if (o == caller) return;
        } catch {}
        revert UnauthorizedLineOperator(account, caller);
    }

    function _bytes4ToHex(bytes4 b) internal pure returns (string memory) {
        bytes memory h = new bytes(8);
        bytes memory chars = "0123456789abcdef";
        for (uint256 i = 0; i < 4; i++) {
            h[i * 2]     = chars[uint8(b[i]) >> 4];
            h[i * 2 + 1] = chars[uint8(b[i]) & 0x0f];
        }
        return string(h);
    }

    function _bytesToHex(bytes calldata b) internal pure returns (string memory) {
        bytes memory h = new bytes(b.length * 2);
        bytes memory chars = "0123456789abcdef";
        for (uint256 i = 0; i < b.length; i++) {
            h[i * 2]     = chars[uint8(b[i]) >> 4];
            h[i * 2 + 1] = chars[uint8(b[i]) & 0x0f];
        }
        return string(h);
    }
}`;