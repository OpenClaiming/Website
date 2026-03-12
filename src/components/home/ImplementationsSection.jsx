import { useState } from "react";
import SectionReveal from "../SectionReveal";
import CodeBlock from "../CodeBlock";

const implementations = {
  javascript: {
    label: "JavaScript",
    code: `class OpenClaims {
  static sign(claim, privateKey) {
    const canonical = this.canonicalize(claim);
    const hash = crypto.createHash('sha256').update(canonical).digest();
    const signature = crypto.sign(null, hash, privateKey);
    return signature.toString('base64url');
  }

  static verify(claim, signature, publicKey) {
    const canonical = this.canonicalize(claim);
    const hash = crypto.createHash('sha256').update(canonical).digest();
    const sig = Buffer.from(signature, 'base64url');
    return crypto.verify(null, hash, publicKey, sig);
  }

  static canonicalize(obj) {
    return JSON.stringify(obj, Object.keys(obj).sort());
  }
}`
  },
  python: {
    label: "Python",
    code: `import json
import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec

class OpenClaims:
    @staticmethod
    def sign(claim, private_key):
        canonical = OpenClaims.canonicalize(claim)
        digest = hashlib.sha256(canonical.encode()).digest()
        signature = private_key.sign(digest, ec.ECDSA(hashes.SHA256()))
        return signature.hex()

    @staticmethod
    def verify(claim, signature, public_key):
        canonical = OpenClaims.canonicalize(claim)
        digest = hashlib.sha256(canonical.encode()).digest()
        sig_bytes = bytes.fromhex(signature)
        try:
            public_key.verify(sig_bytes, digest, ec.ECDSA(hashes.SHA256()))
            return True
        except:
            return False

    @staticmethod
    def canonicalize(obj):
        return json.dumps(obj, sort_keys=True, separators=(',', ':'))`
  },
  go: {
    label: "Go",
    code: `package openclaims

import (
    "crypto/ecdsa"
    "crypto/sha256"
    "encoding/json"
    "sort"
)

func Sign(claim map[string]interface{}, privateKey *ecdsa.PrivateKey) ([]byte, error) {
    canonical := Canonicalize(claim)
    hash := sha256.Sum256([]byte(canonical))
    return ecdsa.SignASN1(rand.Reader, privateKey, hash[:])
}

func Verify(claim map[string]interface{}, signature []byte, publicKey *ecdsa.PublicKey) bool {
    canonical := Canonicalize(claim)
    hash := sha256.Sum256([]byte(canonical))
    return ecdsa.VerifyASN1(publicKey, hash[:], signature)
}

func Canonicalize(obj map[string]interface{}) string {
    keys := make([]string, 0, len(obj))
    for k := range obj {
        keys = append(keys, k)
    }
    sort.Strings(keys)
    result, _ := json.Marshal(obj)
    return string(result)
}`
  },
  rust: {
    label: "Rust",
    code: `use p256::ecdsa::{SigningKey, VerifyingKey, Signature, signature::Signer, signature::Verifier};
use sha2::{Sha256, Digest};
use serde_json::Value;

pub struct OpenClaims;

impl OpenClaims {
    pub fn sign(claim: &Value, private_key: &SigningKey) -> Signature {
        let canonical = Self::canonicalize(claim);
        let hash = Sha256::digest(canonical.as_bytes());
        private_key.sign(&hash)
    }

    pub fn verify(claim: &Value, signature: &Signature, public_key: &VerifyingKey) -> bool {
        let canonical = Self::canonicalize(claim);
        let hash = Sha256::digest(canonical.as_bytes());
        public_key.verify(&hash, signature).is_ok()
    }

    pub fn canonicalize(obj: &Value) -> String {
        serde_json::to_string(obj).unwrap()
    }
}`
  },
  php: {
    label: "PHP",
    code: `<?php
class OpenClaims {
    public static function sign($claim, $privateKey) {
        $canonical = self::canonicalize($claim);
        $hash = hash('sha256', $canonical, true);
        openssl_sign($hash, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        return base64_encode($signature);
    }

    public static function verify($claim, $signature, $publicKey) {
        $canonical = self::canonicalize($claim);
        $hash = hash('sha256', $canonical, true);
        $sig = base64_decode($signature);
        return openssl_verify($hash, $sig, $publicKey, OPENSSL_ALGO_SHA256) === 1;
    }

    public static function canonicalize($obj) {
        ksort($obj);
        return json_encode($obj, JSON_UNESCAPED_SLASHES);
    }
}`
  }
};

export default function ImplementationsSection() {
  const [selected, setSelected] = useState("javascript");
  const current = implementations[selected];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Implementations
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Reference libraries available for multiple languages. Each implements the core methods: sign, verify, and canonicalize.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(implementations).map(([key, { label }]) => (
              <a
                key={key}
                href={`/Implementations#${key}`}
                className="px-5 py-2.5 text-sm font-mono rounded-lg border transition-all bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
                style={{ cursor: 'pointer' }}
              >
                {label}
              </a>
            ))}
          </div>

          <CodeBlock code={current.code} language={selected} className="shadow-xl shadow-gray-900/10" />
        </SectionReveal>
      </div>
    </section>
  );
}