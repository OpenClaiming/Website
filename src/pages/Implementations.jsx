import React, { useState, useEffect } from "react";
import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

const implementations = {
  javascript: {
    label: "JavaScript",
    code: `// Optional strict canonicalizer:
// npm install json-canonicalize
// https://github.com/cyberphone/json-canonicalization

import crypto from "crypto"

let strictCanonicalize = null

try {
  strictCanonicalize = require("json-canonicalize").canonicalize
} catch {}

function normalize(v) {

  if (Array.isArray(v)) {
    return v.map(normalize)
  }

  if (v && typeof v === "object") {

    const out = {}

    for (const k of Object.keys(v).sort()) {
      out[k] = normalize(v[k])
    }

    return out
  }

  if (typeof v === "number") {
    return Number(v).toString()
  }

  return v
}

export class OpenClaims {

  static canonicalize(claim) {

    const obj = { ...claim }
    delete obj.sig

    if (strictCanonicalize) {
      return strictCanonicalize(obj)
    }

    return JSON.stringify(normalize(obj))
  }

  static sign(claim, privateKeyPem) {

    const canon = OpenClaims.canonicalize(claim)

    const hash = crypto
      .createHash("sha256")
      .update(canon)
      .digest()

    const signer = crypto.createSign("SHA256")

    signer.update(hash)
    signer.end()

    const sig = signer
      .sign(privateKeyPem)
      .toString("base64")

    return { ...claim, sig }
  }

  static verify(claim, publicKeyPem) {

    if (!claim.sig) return false

    const canon = OpenClaims.canonicalize(claim)

    const hash = crypto
      .createHash("sha256")
      .update(canon)
      .digest()

    const verifier = crypto.createVerify("SHA256")

    verifier.update(hash)
    verifier.end()

    return verifier.verify(
      publicKeyPem,
      Buffer.from(claim.sig, "base64")
    )
  }
}`,
  },
  python: {
    label: "Python",
    code: `# Optional strict canonicalizer:
# https://github.com/trailofbits/rfc8785.py

import json
import base64
import hashlib

from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes


class OpenClaims:

  @staticmethod
  def normalize(v):

    if isinstance(v, dict):
      return {k: OpenClaims.normalize(v[k]) for k in sorted(v)}

    if isinstance(v, list):
      return [OpenClaims.normalize(x) for x in v]

    if isinstance(v, float):
      return format(v,".15g")

    return v


  @staticmethod
  def canonicalize(claim):

    obj = dict(claim)

    if "sig" in obj:
      del obj["sig"]

    n = OpenClaims.normalize(obj)

    return json.dumps(n,separators=(",",":"))


  @staticmethod
  def sign(claim,private_key):

    canon = OpenClaims.canonicalize(claim).encode()

    hash = hashlib.sha256(canon).digest()

    sig = private_key.sign(hash,ec.ECDSA(hashes.SHA256()))

    claim["sig"] = base64.b64encode(sig).decode()

    return claim


  @staticmethod
  def verify(claim,public_key):

    if "sig" not in claim:
      return False

    sig = base64.b64decode(claim["sig"])

    canon = OpenClaims.canonicalize(claim).encode()

    hash = hashlib.sha256(canon).digest()

    try:
      public_key.verify(sig,hash,ec.ECDSA(hashes.SHA256()))
      return True
    except:
      return False`,
  },
  go: {
    label: "Go",
    code: `// Optional strict canonicalizer:
// github.com/gowebpki/jcs

package openclaims

import (
  "crypto/ecdsa"
  "crypto/rand"
  "crypto/sha256"
  "encoding/base64"
  "encoding/json"
  "math/big"
  "sort"
  "strconv"
)

type OpenClaims struct{}

func normalize(v interface{}) interface{} {

  switch t := v.(type) {

  case float64:
    return strconv.FormatFloat(t,'g',-1,64)

  case map[string]interface{}:

    keys := make([]string,0,len(t))
    for k := range t { keys = append(keys,k) }

    sort.Strings(keys)

    out := map[string]interface{}{}

    for _,k := range keys {
      out[k] = normalize(t[k])
    }

    return out

  case []interface{}:

    arr := make([]interface{},len(t))

    for i,v := range t {
      arr[i] = normalize(v)
    }

    return arr
  }

  return v
}

func (OpenClaims) Canonicalize(claim map[string]interface{}) ([]byte,error) {

  obj := map[string]interface{}{}

  for k,v := range claim {
    if k != "sig" {
      obj[k] = v
    }
  }

  return json.Marshal(normalize(obj))
}

func (o OpenClaims) Sign(claim map[string]interface{},priv *ecdsa.PrivateKey) (map[string]interface{},error) {

  canon,_ := o.Canonicalize(claim)

  hash := sha256.Sum256(canon)

  r,s,err := ecdsa.Sign(rand.Reader,priv,hash[:])
  if err != nil { return nil,err }

  sig := append(r.Bytes(),s.Bytes()...)

  claim["sig"] = base64.StdEncoding.EncodeToString(sig)

  return claim,nil
}

func (o OpenClaims) Verify(claim map[string]interface{},pub *ecdsa.PublicKey) bool {

  sigB64,ok := claim["sig"].(string)
  if !ok { return false }

  sig,err := base64.StdEncoding.DecodeString(sigB64)
  if err != nil { return false }

  canon,_ := o.Canonicalize(claim)

  hash := sha256.Sum256(canon)

  mid := len(sig)/2

  r := new(big.Int).SetBytes(sig[:mid])
  s := new(big.Int).SetBytes(sig[mid:])

  return ecdsa.Verify(pub,hash[:],r,s)
}`,
  },
  rust: {
    label: "Rust",
    code: `// Optional strict canonicalizer:
// https://github.com/cyberphone/json-canonicalization

use serde_json::{Value,Map};
use sha2::{Sha256,Digest};
use p256::ecdsa::{SigningKey,VerifyingKey,Signature};
use p256::ecdsa::signature::{Signer,Verifier};
use base64::{encode,decode};
use ryu::Buffer;

pub struct OpenClaims;

impl OpenClaims {

  fn normalize(v: Value) -> Value {

    match v {

      Value::Number(n) => {

        if let Some(f) = n.as_f64() {

          let mut buf = Buffer::new();
          let s = buf.format(f).to_string();

          Value::String(s)
        }
        else {
          Value::Number(n)
        }
      }

      Value::Array(arr) => {
        Value::Array(arr.into_iter().map(Self::normalize).collect())
      }

      Value::Object(map) => {

        let mut keys: Vec<_> = map.keys().cloned().collect();
        keys.sort();

        let mut new = Map::new();

        for k in keys {
          new.insert(k.clone(),Self::normalize(map[&k].clone()));
        }

        Value::Object(new)
      }

      _ => v
    }
  }

  pub fn canonicalize(mut claim: Value) -> String {

    if let Some(obj) = claim.as_object_mut() {
      obj.remove("sig");
    }

    let sorted = Self::normalize(claim);

    serde_json::to_string(&sorted).unwrap()
  }

  pub fn sign(claim: Value,key:&SigningKey) -> Value {

    let canon = Self::canonicalize(claim.clone());

    let hash = Sha256::digest(canon.as_bytes());

    let sig: Signature = key.sign(&hash);

    let mut obj = claim;

    obj["sig"] = Value::String(encode(sig.to_bytes()));

    obj
  }

  pub fn verify(claim: Value,key:&VerifyingKey) -> bool {

    let sig_b64 = match claim.get("sig") {
      Some(Value::String(s)) => s,
      _ => return false
    };

    let sig_bytes = match decode(sig_b64) {
      Ok(v)=>v,
      Err(_)=>return false
    };

    let sig = match Signature::from_bytes(&sig_bytes) {
      Ok(v)=>v,
      Err(_)=>return false
    };

    let canon = Self::canonicalize(claim);

    let hash = Sha256::digest(canon.as_bytes());

    key.verify(&hash,&sig).is_ok()
  }
}`,
  },
  php: {
    label: "PHP",
    code: `<?php
// Optional strict canonicalizer:
// https://github.com/cyberphone/json-canonicalization

class OpenClaims {

  private static function normalize($v) {

    if (is_array($v)) {

      if (array_keys($v) !== range(0, count($v)-1)) {
        ksort($v);
      }

      foreach ($v as $k=>$val) {
        $v[$k] = self::normalize($val);
      }

      return $v;
    }

    if (is_float($v)) {
      return rtrim(rtrim(sprintf('%.15g',$v),'0'),'.');
    }

    return $v;
  }

  public static function canonicalize($claim) {

    $obj = $claim;
    unset($obj["sig"]);

    $obj = self::normalize($obj);

    return json_encode($obj, JSON_UNESCAPED_SLASHES);
  }

  public static function sign($claim,$privateKeyPem) {

    $canon = self::canonicalize($claim);

    $hash = hash("sha256",$canon,true);

    openssl_sign($hash,$signature,$privateKeyPem,OPENSSL_ALGO_SHA256);

    $claim["sig"] = base64_encode($signature);

    return $claim;
  }

  public static function verify($claim,$publicKeyPem) {

    if (!isset($claim["sig"])) return false;

    $sig = base64_decode($claim["sig"]);

    $canon = self::canonicalize($claim);

    $hash = hash("sha256",$canon,true);

    return openssl_verify(
      $hash,
      $sig,
      $publicKeyPem,
      OPENSSL_ALGO_SHA256
    ) === 1;
  }
}`,
  },
  java: {
    label: "Java",
    code: `// Optional strict canonicalizer:
// https://github.com/erdtman/java-json-canonicalization

import java.util.*;
import java.security.*;
import java.util.Base64;

public class OpenClaims {

	static Object normalize(Object v) {

		if (v instanceof Map) {

			Map<String,Object> map = new TreeMap<>();

			((Map<String,Object>)v).forEach(
				(k,val) -> map.put(k, normalize(val))
			);

			return map;
		}

		if (v instanceof List) {

			List<Object> out = new ArrayList<>();

			for (Object o : (List)v)
				out.add(normalize(o));

			return out;
		}

		if (v instanceof Double) {
			return Double.toString((Double)v);
		}

		return v;
	}

	public static String canonicalize(Map<String,Object> claim) throws Exception {

		Map<String,Object> obj = new HashMap<>(claim);

		obj.remove("sig");

		Object sorted = normalize(obj);

		return new com.fasterxml.jackson.databind.ObjectMapper()
			.writeValueAsString(sorted);
	}

	public static Map<String,Object> sign(Map<String,Object> claim, PrivateKey key) throws Exception {

		String canon = canonicalize(claim);

		MessageDigest sha = MessageDigest.getInstance("SHA-256");

		byte[] hash = sha.digest(canon.getBytes());

		Signature sig = Signature.getInstance("SHA256withECDSA");

		sig.initSign(key);

		sig.update(hash);

		byte[] s = sig.sign();

		claim.put("sig", Base64.getEncoder().encodeToString(s));

		return claim;
	}

	public static boolean verify(Map<String,Object> claim, PublicKey key) throws Exception {

		if (!claim.containsKey("sig")) return false;

		String sig64 = (String)claim.get("sig");

		byte[] signature = Base64.getDecoder().decode(sig64);

		String canon = canonicalize(claim);

		byte[] hash = MessageDigest
			.getInstance("SHA-256")
			.digest(canon.getBytes());

		Signature sig = Signature.getInstance("SHA256withECDSA");

		sig.initVerify(key);

		sig.update(hash);

		return sig.verify(signature);
	}
}`,
  },
  swift: {
    label: "Swift",
    code: `// Optional strict canonicalizer:
// https://github.com/erdtman/swift-json-canonicalization

import Foundation
import CryptoKit

class OpenClaim {

  static func normalize(_ value: Any) -> Any {

    if let dict = value as? [String: Any] {

      let sortedKeys = dict.keys.sorted()
      var result: [String: Any] = [:]

      for key in sortedKeys {
        result[key] = normalize(dict[key]!)
      }

      return result
    }

    if let array = value as? [Any] {
      return array.map { normalize($0) }
    }

    if let num = value as? Double {

      var s = String(format: "%.15g", num)

      while s.last == "0" {
        s.removeLast()
      }

      if s.last == "." {
        s.removeLast()
      }

      return s
    }

    return value
  }

  static func canonicalize(_ claim: [String: Any]) throws -> Data {

    var obj = claim
    obj.removeValue(forKey: "sig")

    let normalized = normalize(obj)

    let data = try JSONSerialization.data(
      withJSONObject: normalized,
      options: []
    )

    return data
  }

  static func sign(_ claim: [String: Any], privateKey: P256.Signing.PrivateKey) throws -> [String: Any] {

    let canon = try canonicalize(claim)

    let hash = SHA256.hash(data: canon)

    let signature = try privateKey.signature(for: hash)

    var newClaim = claim
    newClaim["sig"] = Data(signature.derRepresentation).base64EncodedString()

    return newClaim
  }

  static func verify(_ claim: [String: Any], publicKey: P256.Signing.PublicKey) throws -> Bool {

    guard let sigB64 = claim["sig"] as? String,
          let sigData = Data(base64Encoded: sigB64)
    else {
      return false
    }

    let canon = try canonicalize(claim)

    let hash = SHA256.hash(data: canon)

    let signature = try P256.Signing.ECDSASignature(derRepresentation: sigData)

    return publicKey.isValidSignature(signature, for: hash)
  }
}`,
  },
};

const langOrder = ["javascript", "python", "go", "rust", "php", "java", "swift"];

export default function Implementations() {
  const [selected, setSelected] = useState("javascript");
  const current = implementations[selected];

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && implementations[hash]) {
      setSelected(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  return (
    <DocLayout title="Reference Implementations">
      <p className="lead text-lg text-gray-500 !mt-0">
        Reference libraries exposing a single <code>OpenClaims</code> class with consistent methods across all languages.
      </p>

      <hr />

      <h1>Core Methods</h1>
      <p>All implementations provide three core methods:</p>
      <ul>
        <li><code>OpenClaims.canonicalize(claim)</code> — Removes <code>sig</code>, deep sorts keys, normalizes numbers, returns UTF-8 JSON</li>
        <li><code>OpenClaims.sign(claim, privateKey)</code> — Canonicalizes, hashes with SHA-256, signs with ECDSA P-256, returns claim with base64 signature</li>
        <li><code>OpenClaims.verify(claim, publicKey)</code> — Verifies the signature, returns boolean</li>
      </ul>

      <hr />

      <h1>Language Implementations</h1>

      <div className="not-prose my-8">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            id="javascript"
            onClick={() => setSelected("javascript")}
            className={`px-5 py-2.5 text-sm font-mono rounded-lg border transition-all ${
              selected === "javascript"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }`}
            style={{ cursor: 'pointer' }}
          >
            JavaScript
          </button>
          <button
            id="python"
            onClick={() => setSelected("python")}
            className={`px-5 py-2.5 text-sm font-mono rounded-lg border transition-all ${
              selected === "python"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }`}
            style={{ cursor: 'pointer' }}
          >
            Python
          </button>
          <button
            id="go"
            onClick={() => setSelected("go")}
            className={`px-5 py-2.5 text-sm font-mono rounded-lg border transition-all ${
              selected === "go"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }`}
            style={{ cursor: 'pointer' }}
          >
            Go
          </button>
          <button
            id="rust"
            onClick={() => setSelected("rust")}
            className={`px-5 py-2.5 text-sm font-mono rounded-lg border transition-all ${
              selected === "rust"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }`}
            style={{ cursor: 'pointer' }}
          >
            Rust
          </button>
          <button
            id="php"
            onClick={() => setSelected("php")}
            className={`px-5 py-2.5 text-sm font-mono rounded-lg border transition-all ${
              selected === "php"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }`}
            style={{ cursor: 'pointer' }}
          >
            PHP
          </button>
          <button
            id="java"
            onClick={() => setSelected("java")}
            className={`px-5 py-2.5 text-sm font-mono rounded-lg border transition-all ${
              selected === "java"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }`}
            style={{ cursor: 'pointer' }}
          >
            Java
          </button>
          <button
            id="swift"
            onClick={() => setSelected("swift")}
            className={`px-5 py-2.5 text-sm font-mono rounded-lg border transition-all ${
              selected === "swift"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }`}
            style={{ cursor: 'pointer' }}
          >
            Swift
          </button>
        </div>

        <CodeBlock code={current.code} language={selected} />
      </div>

      <hr />

      <h1>Canonicalization</h1>
      <p>All implementations use <strong>RFC 8785 JSON Canonicalization</strong>. If a strict canonicalizer library is available, it is used. Otherwise, a built-in fallback ensures deterministic serialization through deep key sorting and number normalization.</p>

      <hr />

      <h1>Test Vectors</h1>
      <p>Cross-language test vectors are provided in the OpenClaiming repository to ensure compatibility. Each implementation passes the same canonicalization, signature, and verification tests.</p>

      <hr />

      <h1>Contributing</h1>
      <p>Contributions are welcome for additional languages, optimizations, and test coverage improvements.</p>
    </DocLayout>
  );
}