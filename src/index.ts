import SimpleSigner from './software-signer/signers/SimpleSigner.js'
import EllipticSigner from './software-signer/signers/EllipticSigner.js'
import NaclSigner from './software-signer/signers/NaclSigner.js'
import { ES256KSigner } from './software-signer/signers/ES256KSigner.js'
import { ES256Signer } from './software-signer/signers/ES256Signer.js'
import { EdDSASigner } from './software-signer/signers/EdDSASigner.js'
import {
  createJWS,
  createJWT,
  createMultisignatureJWT,
  decodeJWT,
  type JWTHeader,
  type JWTPayload,
  type JWTVerified,
  type Signer,
  verifyJWS,
  verifyJWT,
} from './JWT.js'
export { toEthereumAddress, concatKDF } from './Digest.js'

export { createJWE, decryptJWE } from './encryption/JWE.js'
export { xc20pDirDecrypter, xc20pDirEncrypter } from './encryption/xc20pDir.js'
export * from './encryption/types.js'
export * from './encryption/X25519-ECDH-ES.js'
export * from './encryption/X25519-ECDH-1PU.js'

export { createX25519ECDH } from './encryption/ECDH.js'
export {
  x25519Encrypter,
  x25519Decrypter,
  resolveX25519Encrypters,
  createAuthEncrypter,
  createAnonEncrypter,
  createAuthDecrypter,
  createAnonDecrypter,
  xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2,
  xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2,
} from './encryption/xc20pEncryption.js'

export { createFullEncrypter } from './encryption/createEncrypter.js'

export {
  SimpleSigner,
  EllipticSigner,
  NaclSigner,
  ES256Signer,
  ES256KSigner,
  EdDSASigner,
  verifyJWT,
  createJWT,
  createMultisignatureJWT,
  decodeJWT,
  verifyJWS,
  createJWS,
  type Signer,
  type JWTHeader,
  type JWTPayload,
  type JWTVerified,
}

export { AbstractSigner } from './AbstractSigner.js'
export { AbstractVerifier } from './AbstractVerifier.js'

export { SoftwareSigner } from './software-signer/SoftwareSigner.js'
export type { SignAlgorithm } from './software-signer/SoftwareSigner.js'

export { SoftwareVerifier } from './software-verifier/SoftwareVerifier.js'

export { type JWTOptions, type JWTVerifyOptions } from './JWT.js'

export {
  base64ToBytes,
  bytesToBase64url,
  base58ToBytes,
  bytesToBase58,
  hexToBytes,
  bytesToHex,
  genX25519EphemeralKeyPair,
  multibaseToBytes,
  bytesToMultibase,
  supportedCodecs,
  extractPublicKeyBytes,
} from './util.js'

export * from './Errors.js'
