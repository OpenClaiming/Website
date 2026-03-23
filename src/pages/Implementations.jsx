import React, { useState, useEffect } from "react";
import DocLayout from "../components/docs/DocLayout";
import CodeBlock from "../components/CodeBlock";

const implementations = {
  javascript: {
    label: "JavaScript",
    code: `// Optional strict canonicalizer:
// Maven:
// <dependency>
//   <groupId>org.webpki</groupId>
//   <artifactId>json-canonicalization</artifactId>
// </dependency>
// https://github.com/cyberphone/json-canonicalization
//
// HTTP fetch:
// Uses java.net.URL (built-in)
//
// Base64:
// Uses java.util.Base64
//
// JSON:
// Uses Jackson (com.fasterxml.jackson.databind)
//
// P-256 / ECDSA:
// Uses java.security (EC)
//
// SHA-256:
// Uses java.security.MessageDigest
//
// Note:
// Fallback canonicalization:
// - lexicographically sorted keys
// - arrays preserved
// - numbers converted to strings
// - no whitespace
//
// Signing model:
// signature = sign( SHA256(canonicalized_claim) )

package openclaiming;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.webpki.json.JSONCanonicalizer;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class OpenClaim {

	private static final ObjectMapper mapper = new ObjectMapper();

	static {
		mapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
	}

	// ---------- CACHE ----------

	private static final long TTL = 60_000;

	private static class CacheEntry<T> {
		long time;
		T value;
		CacheEntry(long t, T v) { time = t; value = v; }
	}

	private static final Map<String, CacheEntry<String>> urlCache = new ConcurrentHashMap<>();
	private static final Map<String, CacheEntry<Object>> keyCache = new ConcurrentHashMap<>();
	private static final Map<String, CacheEntry<PublicKey>> pubKeyCache = new ConcurrentHashMap<>();

	private static long now() {
		return System.currentTimeMillis();
	}

	private static <T> T getCache(Map<String, CacheEntry<T>> map, String key) {
		CacheEntry<T> e = map.get(key);
		if (e != null && now() - e.time < TTL) return e.value;
		map.remove(key);
		return null;
	}

	private static <T> void setCache(Map<String, CacheEntry<T>> map, String key, T value) {
		map.put(key, new CacheEntry<>(now(), value));
	}

	// ---------- NORMALIZATION ----------

	private static Object normalize(Object v) {

		if (v instanceof Map<?,?> map) {

			Map<String,Object> sorted = new TreeMap<>();

			for (var e : map.entrySet()) {
				sorted.put(e.getKey().toString(), normalize(e.getValue()));
			}

			return sorted;
		}

		if (v instanceof List<?> list) {

			List<Object> out = new ArrayList<>();

			for (Object x : list) {
				out.add(normalize(x));
			}

			return out;
		}

		if (v instanceof Number) {
			return v.toString();
		}

		return v;
	}

	// ---------- CANONICALIZATION ----------

	private static byte[] fallbackCanonicalize(Map<String,Object> claim) throws Exception {

		Map<String,Object> obj = new HashMap<>(claim);
		obj.remove("sig");

		Object normalized = normalize(obj);

		return mapper.writeValueAsBytes(normalized);
	}

	public static byte[] canonicalize(Map<String,Object> claim) throws Exception {

		Map<String,Object> obj = new HashMap<>(claim);
		obj.remove("sig");

		try {
			String json = mapper.writeValueAsString(obj);
			return new JSONCanonicalizer(json).getEncodedUTF8();
		} catch (Exception e) {
			return fallbackCanonicalize(claim);
		}
	}

	// ---------- HASH ----------

	private static byte[] sha256(byte[] data) throws Exception {
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		return md.digest(data);
	}

	// ---------- PEM / DER ----------

	private static String derToPem(String base64) {
		return "-----BEGIN PUBLIC KEY-----\n" + base64 + "\n-----END PUBLIC KEY-----";
	}

	private static PublicKey getCachedPublicKey(String base64) throws Exception {

		PublicKey cached = getCache(pubKeyCache, base64);
		if (cached != null) return cached;

		byte[] decoded = Base64.getDecoder().decode(base64);
		KeyFactory kf = KeyFactory.getInstance("EC");
		PublicKey key = kf.generatePublic(new X509EncodedKeySpec(decoded));

		setCache(pubKeyCache, base64, key);
		return key;
	}

	// ---------- DATA KEY ----------

	private static Map<String,Object> parseDataKey(String key) {

		if (!key.startsWith("data:key/")) return null;

		int idx = key.indexOf(",");
		if (idx < 0) return null;

		String meta = key.substring(5, idx);
		String data = key.substring(idx + 1);

		String[] parts = meta.split(";");
		String fmt = parts[0].replace("key/", "").toUpperCase();

		String encoding = "raw";
		for (int i = 1; i < parts.length; i++) {
			if (parts[i].equals("base64")) encoding = "base64";
			if (parts[i].equals("base64url")) encoding = "base64url";
		}

		Object value = data;

		if (encoding.equals("base64")) {
			value = Base64.getDecoder().decode(data);
		}

		return Map.of("fmt", fmt, "value", value);
	}

	// ---------- FETCH ----------

	private static String fetchJson(String url) {

		String cached = getCache(urlCache, url);
		if (cached != null) return cached;

		String data = null;

		try {
			BufferedReader in = new BufferedReader(
				new InputStreamReader(new URL(url).openStream())
			);

			StringBuilder sb = new StringBuilder();
			String line;

			while ((line = in.readLine()) != null) {
				sb.append(line);
			}

			in.close();
			data = sb.toString();

		} catch (Exception ignored) {}

		setCache(urlCache, url, data);
		return data;
	}

	// ---------- KEY RESOLUTION ----------

	private static Object resolveKey(String key, Set<String> seen) throws Exception {

		if (seen.contains(key)) {
			throw new RuntimeException("OpenClaim: cyclic key reference detected");
		}

		Object cached = getCache(keyCache, key);
		if (cached != null) return cached;

		Set<String> next = new HashSet<>(seen);
		next.add(key);

		if (key.startsWith("data:key/")) {
			Object parsed = parseDataKey(key);
			setCache(keyCache, key, parsed);
			return parsed;
		}

		if (key.startsWith("http")) {

			String[] parts = key.split("#");
			String raw = fetchJson(parts[0]);
			if (raw == null) return null;

			Object json = mapper.readValue(raw, Map.class);
			Object current = json;

			for (int i = 1; i < parts.length; i++) {
				if (current instanceof Map<?,?> m) {
					current = m.get(parts[i]);
				}
			}

			if (current instanceof List<?>) {
				setCache(keyCache, key, current);
				return current;
			}

			if (current instanceof String s) {
				Object resolved = resolveKey(s, next);
				setCache(keyCache, key, resolved);
				return resolved;
			}

			return null;
		}

		int idx = key.indexOf(":");
		if (idx > 0) {
			Map<String,Object> result = Map.of(
				"fmt", key.substring(0, idx).toUpperCase(),
				"value", key.substring(idx + 1)
			);
			setCache(keyCache, key, result);
			return result;
		}

		return null;
	}

	// ---------- SIGN ----------

	public static Map<String,Object> sign(
		Map<String,Object> claim,
		PrivateKey privateKey
	) throws Exception {

		PublicKey pub = KeyFactory.getInstance("EC")
			.generatePublic(new X509EncodedKeySpec(
				KeyFactory.getInstance("EC")
					.getKeySpec(privateKey, X509EncodedKeySpec.class)
					.getEncoded()
			));

		String keyStr = "data:key/es256;base64," +
			Base64.getEncoder().encodeToString(pub.getEncoded());

		List<String> keys = new ArrayList<>();
		if (claim.get("key") instanceof List<?> list) {
			for (Object o : list) keys.add(o.toString());
		}

		if (!keys.contains(keyStr)) keys.add(keyStr);

		Collections.sort(keys);

		List<String> sigs = new ArrayList<>();
		if (claim.get("sig") instanceof List<?> list) {
			for (Object o : list) sigs.add(o == null ? null : o.toString());
		}

		while (sigs.size() < keys.size()) sigs.add(null);

		int index = keys.indexOf(keyStr);

		Map<String,Object> tmp = new HashMap<>(claim);
		tmp.put("key", keys);
		tmp.put("sig", sigs);

		byte[] canon = canonicalize(tmp);
		byte[] hash = sha256(canon);

		Signature signer = Signature.getInstance("NONEwithECDSA");
		signer.initSign(privateKey);
		signer.update(hash);

		String sig = Base64.getEncoder().encodeToString(signer.sign());

		sigs.set(index, sig);

		Map<String,Object> out = new HashMap<>(claim);
		out.put("key", keys);
		out.put("sig", sigs);

		return out;
	}

	// ---------- VERIFY ----------

	public static boolean verify(Map<String,Object> claim) throws Exception {

		List<String> keys = (List<String>) claim.get("key");
		List<String> sigs = (List<String>) claim.get("sig");

		if (keys == null || keys.isEmpty()) {
			throw new RuntimeException("OpenClaim: missing public keys");
		}

		Map<String,Object> tmp = new HashMap<>(claim);
		tmp.put("key", keys);
		tmp.put("sig", sigs);

		byte[] canon = canonicalize(tmp);
		byte[] hash = sha256(canon);

		int valid = 0;

		for (int i = 0; i < keys.size(); i++) {

			String sigB64 = sigs.get(i);
			if (sigB64 == null) continue;

			Object resolved = resolveKey(keys.get(i), new HashSet<>());

			List<Object> objs = resolved instanceof List<?> l ? (List<Object>) l : List.of(resolved);

			for (Object obj : objs) {

				if (!(obj instanceof Map<?,?> m)) continue;

				if (!"ES256".equals(m.get("fmt"))) continue;

				String der = m.get("value") instanceof byte[]
					? Base64.getEncoder().encodeToString((byte[]) m.get("value"))
					: m.get("value").toString();

				PublicKey pub = getCachedPublicKey(der);

				Signature verifier = Signature.getInstance("NONEwithECDSA");
				verifier.initVerify(pub);
				verifier.update(hash);

				if (verifier.verify(Base64.getDecoder().decode(sigB64))) {
					valid++;
					break;
				}
			}
		}

		return valid >= 1;
	}
}`,
  },
  python: {
    label: "Python",
    code: `# Optional strict canonicalizer:
# pip install rfc8785
# https://github.com/trailofbits/rfc8785.py

import json
import base64

from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes

try:
	import rfc8785
	STRICT = True
except ImportError:
	STRICT = False


class OpenClaim:

	@staticmethod
	def normalize(v):

		if isinstance(v, dict):
			return {k: OpenClaim.normalize(v[k]) for k in sorted(v)}

		if isinstance(v, list):
			return [OpenClaim.normalize(x) for x in v]

		return v


	@staticmethod
	def fallback_canonicalize(obj):

		n = OpenClaim.normalize(obj)

		return json.dumps(
			n,
			separators=(",",":")
		).encode()


	@staticmethod
	def canonicalize(claim):

		obj = dict(claim)

		obj.pop("sig", None)

		if STRICT:
			try:
				return rfc8785.canonicalize(obj)
			except Exception:
				pass

		return OpenClaim.fallback_canonicalize(obj)


	@staticmethod
	def sign(claim, private_key):

		canon = OpenClaim.canonicalize(claim)

		sig = private_key.sign(
			canon,
			ec.ECDSA(hashes.SHA256())
		)

		out = dict(claim)

		out["sig"] = base64.b64encode(sig).decode()

		return out


	@staticmethod
	def verify(claim, public_key):

		sig_b64 = claim.get("sig")

		if not sig_b64:
			return False

		sig = base64.b64decode(sig_b64)

		canon = OpenClaim.canonicalize(claim)

		try:
			public_key.verify(
				sig,
				canon,
				ec.ECDSA(hashes.SHA256())
			)
			return True
		except Exception:
			return False`,
  },
  go: {
    label: "Go",
    code: `package openclaiming

import (
	"crypto/ecdsa"
	"crypto/rand"
	"crypto/sha256"
	"encoding/asn1"
	"encoding/base64"
	"encoding/json"
	"errors"
	"math/big"
	"sort"

	jcs "github.com/gowebpki/jcs"
)

type ecdsaSignature struct {
	R, S *big.Int
}

func normalize(v interface{}) interface{} {

	switch t := v.(type) {

	case map[string]interface{}:

		keys := make([]string, 0, len(t))
		for k := range t {
			keys = append(keys, k)
		}

		sort.Strings(keys)

		out := map[string]interface{}{}

		for _, k := range keys {
			out[k] = normalize(t[k])
		}

		return out

	case []interface{}:

		arr := make([]interface{}, len(t))

		for i, v := range t {
			arr[i] = normalize(v)
		}

		return arr
	}

	return v
}

func fallbackCanonicalize(claim map[string]interface{}) ([]byte, error) {

	obj := map[string]interface{}{}

	for k, v := range claim {
		if k != "sig" {
			obj[k] = v
		}
	}

	return json.Marshal(normalize(obj))
}

func Canonicalize(claim map[string]interface{}) ([]byte, error) {

	obj := map[string]interface{}{}

	for k, v := range claim {
		if k != "sig" {
			obj[k] = v
		}
	}

	raw, err := json.Marshal(obj)
	if err != nil {
		return nil, err
	}

	// Try strict RFC8785 canonicalization
	canon, err := jcs.Transform(raw)
	if err == nil {
		return canon, nil
	}

	// Fallback deterministic canonicalization
	return fallbackCanonicalize(claim)
}

func Sign(claim map[string]interface{}, priv *ecdsa.PrivateKey) (map[string]interface{}, error) {

	canon, err := Canonicalize(claim)
	if err != nil {
		return nil, err
	}

	hash := sha256.Sum256(canon)

	r, s, err := ecdsa.Sign(rand.Reader, priv, hash[:])
	if err != nil {
		return nil, err
	}

	sig, err := asn1.Marshal(ecdsaSignature{r, s})
	if err != nil {
		return nil, err
	}

	out := map[string]interface{}{}
	for k, v := range claim {
		out[k] = v
	}

	out["sig"] = base64.StdEncoding.EncodeToString(sig)

	return out, nil
}

func Verify(claim map[string]interface{}, pub *ecdsa.PublicKey) (bool, error) {

	sigB64, ok := claim["sig"].(string)
	if !ok {
		return false, errors.New("missing signature")
	}

	sig, err := base64.StdEncoding.DecodeString(sigB64)
	if err != nil {
		return false, err
	}

	var esig ecdsaSignature
	_, err = asn1.Unmarshal(sig, &esig)
	if err != nil {
		return false, err
	}

	canon, err := Canonicalize(claim)
	if err != nil {
		return false, err
	}

	hash := sha256.Sum256(canon)

	ok = ecdsa.Verify(pub, hash[:], esig.R, esig.S)

	return ok, nil
}`,
  },
  rust: {
    label: "Rust",
    code: `use serde_json::{Value,Map};
use p256::ecdsa::{SigningKey,VerifyingKey,Signature};
use p256::ecdsa::signature::{Signer,Verifier};
use base64::{engine::general_purpose,Engine as _};

pub struct OpenClaim;

impl OpenClaim {

	fn normalize(v: Value) -> Value {
		match v {

			Value::Array(a) =>
				Value::Array(a.into_iter().map(Self::normalize).collect()),

			Value::Object(m) => {
				let mut keys: Vec<_> = m.keys().cloned().collect();
				keys.sort();

				let mut out = Map::new();

				for k in keys {
					out.insert(k.clone(),Self::normalize(m[&k].clone()));
				}

				Value::Object(out)
			}

			_ => v
		}
	}

	fn fallback(mut claim: Value) -> String {

		if let Some(o) = claim.as_object_mut() {
			o.remove("sig");
		}

		let sorted = Self::normalize(claim);

		serde_json::to_string(&sorted).unwrap()
	}

	pub fn canonicalize(claim: Value) -> String {

		let mut obj = claim.clone();

		if let Some(o) = obj.as_object_mut() {
			o.remove("sig");
		}

		if let Ok(s) = jcs::to_string(&obj) {
			return s
		}

		Self::fallback(claim)
	}

	pub fn sign(claim: Value,key:&SigningKey) -> Value {

		let canon = Self::canonicalize(claim.clone());

		let sig: Signature = key.sign(canon.as_bytes());

		let mut obj = claim;

		obj["sig"] = Value::String(
			general_purpose::STANDARD.encode(sig.to_bytes())
		);

		obj
	}

	pub fn verify(claim: Value,key:&VerifyingKey) -> bool {

		let sig = match claim.get("sig") {
			Some(Value::String(s)) =>
				match general_purpose::STANDARD.decode(s) {
					Ok(v)=>v,
					Err(_)=>return false
				},
			_ => return false
		};

		let sig = match Signature::from_bytes(&sig) {
			Ok(v)=>v,
			Err(_)=>return false
		};

		let canon = Self::canonicalize(claim);

		key.verify(canon.as_bytes(),&sig).is_ok()
	}
}`,
  },
  php: {
    label: "PHP",
    code: `<?php
// Optional strict canonicalizer:
// composer require sop/json-canonicalization

class OpenClaim {

  private static function normalize($v) {

    if (is_array($v)) {

      // associative array
      if (array_keys($v) !== range(0, count($v)-1)) {
        ksort($v);
      }

      foreach ($v as $k => $val) {
        $v[$k] = self::normalize($val);
      }

      return $v;
    }

    return $v;
  }

  private static function fallbackCanonicalize($claim) {

    unset($claim["sig"]);

    $sorted = self::normalize($claim);

    return json_encode(
      $sorted,
      JSON_UNESCAPED_SLASHES
    );
  }

  public static function canonicalize($claim) {

    $obj = $claim;
    unset($obj["sig"]);

    // Try RFC8785 canonicalization if library installed
    if (class_exists("\\Sop\\JsonCanonicalization\\Canonicalizer")) {

      try {
        $canon = new \\Sop\\JsonCanonicalization\\Canonicalizer();
        return $canon->canonicalize($obj);
      } catch (\\Exception $e) {}
    }

    return self::fallbackCanonicalize($claim);
  }

  public static function sign($claim, $privateKeyPem) {

    $canon = self::canonicalize($claim);

    openssl_sign(
      $canon,
      $signature,
      $privateKeyPem,
      OPENSSL_ALGO_SHA256
    );

    $out = $claim;
    $out["sig"] = base64_encode($signature);

    return $out;
  }

  public static function verify($claim, $publicKeyPem) {

    if (!isset($claim["sig"])) return false;

    $sig = base64_decode($claim["sig"]);

    $canon = self::canonicalize($claim);

    return openssl_verify(
      $canon,
      $sig,
      $publicKeyPem,
      OPENSSL_ALGO_SHA256
    ) === 1;
  }
}`,
  },
  java: {
    label: "Java",
    code: `package openclaiming;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.webpki.json.JSONCanonicalizer;

import java.security.*;
import java.util.*;
import java.util.Base64;

public class OpenClaim {

	private static final ObjectMapper mapper = new ObjectMapper();

	static {
		mapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
	}

	private static Object normalize(Object v) {

		if (v instanceof Map<?,?> map) {

			Map<String,Object> sorted = new TreeMap<>();

			for (var e : map.entrySet()) {
				sorted.put(
					e.getKey().toString(),
					normalize(e.getValue())
				);
			}

			return sorted;
		}

		if (v instanceof List<?> list) {

			List<Object> out = new ArrayList<>();

			for (Object x : list) {
				out.add(normalize(x));
			}

			return out;
		}

		return v;
	}


	private static String fallbackCanonicalize(Map<String,Object> claim)
		throws Exception {

		Map<String,Object> obj = new HashMap<>(claim);

		obj.remove("sig");

		Object normalized = normalize(obj);

		return mapper.writeValueAsString(normalized);
	}


	public static String canonicalize(Map<String,Object> claim)
		throws Exception {

		Map<String,Object> obj = new HashMap<>(claim);

		obj.remove("sig");

		try {

			String json = mapper.writeValueAsString(obj);

			return new String(
				new JSONCanonicalizer(json).getEncodedUTF8()
			);

		} catch (Exception e) {

			return fallbackCanonicalize(claim);
		}
	}


	public static Map<String,Object> sign(
		Map<String,Object> claim,
		PrivateKey privateKey
	) throws Exception {

		String canon = canonicalize(claim);

		Signature signer = Signature.getInstance("SHA256withECDSA");

		signer.initSign(privateKey);

		signer.update(canon.getBytes());

		byte[] sig = signer.sign();

		Map<String,Object> out = new HashMap<>(claim);

		out.put(
			"sig",
			Base64.getEncoder().encodeToString(sig)
		);

		return out;
	}


	public static boolean verify(
		Map<String,Object> claim,
		PublicKey publicKey
	) throws Exception {

		Object sigObj = claim.get("sig");

		if (!(sigObj instanceof String sigB64))
			return false;

		byte[] sig;

		try {
			sig = Base64.getDecoder().decode(sigB64);
		} catch (Exception e) {
			return false;
		}

		String canon = canonicalize(claim);

		Signature verifier = Signature.getInstance("SHA256withECDSA");

		verifier.initVerify(publicKey);

		verifier.update(canon.getBytes());

		return verifier.verify(sig);
	}
}`,
  },
  swift: {
    label: "Swift",
    code: `// swift-tools-version:5.9

import PackageDescription

let package = Package(
	name: "OpenClaiming",
	platforms: [
		.iOS(.v13),
		.macOS(.v12)
	],
	products: [
		.library(
			name: "OpenClaiming",
			targets: ["OpenClaiming"]
		)
	],
	dependencies: [
		.package(
			url: "https://github.com/cyberphone/json-canonicalization",
			from: "1.0.0"
		)
	],
	targets: [
		.target(
			name: "OpenClaiming",
			dependencies: [
				.product(
					name: "JSONCanonicalization",
					package: "json-canonicalization"
				)
			]
		)
	]
)`,
  },
  solidity: {
    label: "Solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOpenClaiming.sol";

contract OpenClaimingConsumer {

	address public constant OPENCLAIMING_ADDRESS = 0x0000000000000000000000000000000000000000;

	IOpenClaiming public constant oc = IOpenClaiming(OPENCLAIMING_ADDRESS);

	error PaymentFailed();
	error InvalidPrice();
	error VerificationFailed();

	event Purchased(
		address indexed payer,
		address indexed token,
		address indexed recipient,
		uint256 amount
	);

	uint256 public constant PRICE = 1e18;

	function purchase(
		IOpenClaiming.Payment calldata payment,
		address[] calldata recipients,
		bytes calldata signature
	) external payable {

		if (PRICE == 0) revert InvalidPrice();

		bool ok = oc.verifyPayment(payment, signature);
		if (!ok) revert VerificationFailed();

		bool success = oc.executePayment{value: msg.value}(
			payment,
			recipients,
			signature,
			payment.line,
			address(this),
			PRICE
		);

		if (!success) revert PaymentFailed();

		_handlePurchase(payment.payer);

		emit Purchased(payment.payer, payment.token, address(this), PRICE);
	}

	function withdraw(address token, address to, uint256 amount) external {

		if (token == address(0)) {
			(bool ok,) = to.call{value: amount}("");
			require(ok, "ETH transfer failed");
		} else {
			(bool ok, bytes memory data) = token.call(
				abi.encodeWithSignature("transfer(address,uint256)", to, amount)
			);
			require(ok && (data.length == 0 || abi.decode(data, (bool))), "ERC20 transfer failed");
		}
	}

	function _handlePurchase(address buyer) internal {
		// implement application logic here
	}

	function canAfford(
		address payer,
		uint256 line,
		uint256 amount
	) external view returns (bool) {
		uint256 available = oc.lineAvailable(payer, line);
		return available >= amount;
	}

	function computeRecipientsHash(address[] calldata recipients)
		external
		pure
		returns (bytes32)
	{
		return keccak256(abi.encodePacked(recipients));
	}

	receive() external payable {}
}`,
  },
};

const langOrder = ["javascript", "python", "go", "rust", "php", "java", "swift", "solidity"];

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
        Reference libraries exposing a single <code>OpenClaim</code> class with consistent methods across all languages.
      </p>

      <hr />

      <h1>Core Methods</h1>
      <p>All implementations provide three core methods:</p>
      <ul>
        <li><code>OpenClaim.canonicalize(claim)</code> — Removes <code>sig</code>, deep sorts keys, normalizes numbers, returns UTF-8 JSON</li>
        <li><code>OpenClaim.sign(claim, privateKey)</code> — Canonicalizes, hashes with SHA-256, signs with ECDSA P-256, returns claim with base64 signature</li>
        <li><code>OpenClaim.verify(claim, publicKey)</code> — Verifies the signature, returns boolean</li>
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
          <button
            id="solidity"
            onClick={() => setSelected("solidity")}
            className={`px-5 py-2.5 text-sm font-mono rounded-lg border transition-all ${
              selected === "solidity"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }`}
            style={{ cursor: 'pointer' }}
          >
            Solidity
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