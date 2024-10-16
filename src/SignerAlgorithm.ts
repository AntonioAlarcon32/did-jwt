import type { Signer, SignerAlgorithm } from './JWT.js'
import { type EcdsaSignature, fromJose, toJose } from './util.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instanceOfEcdsaSignature(object: any): object is EcdsaSignature {
  return typeof object === 'object' && 'r' in object && 's' in object
}

export function ES256SignerAlg(): SignerAlgorithm {
  return async function sign(payload: string, signer: Signer): Promise<string> {
    const signature: EcdsaSignature | string = await signer(payload)
    if (instanceOfEcdsaSignature(signature)) {
      return toJose(signature)
    } else {
      return signature
    }
  }
}

export function ES256KSignerAlg(recoverable?: boolean): SignerAlgorithm {
  return async function sign(payload: string, signer: Signer): Promise<string> {
    const signature: EcdsaSignature | string = await signer(payload)
    if (instanceOfEcdsaSignature(signature)) {
      return toJose(signature, recoverable)
    } else {
      if (recoverable && typeof fromJose(signature).recoveryParam === 'undefined') {
        throw new Error(`not_supported: ES256K-R not supported when signer doesn't provide a recovery param`)
      }
      return signature
    }
  }
}

export function Ed25519SignerAlg(): SignerAlgorithm {
  return async function sign(payload: string, signer: Signer): Promise<string> {
    const signature: EcdsaSignature | string = await signer(payload)
    if (!instanceOfEcdsaSignature(signature)) {
      return signature
    } else {
      throw new Error('invalid_config: expected a signer function that returns a string instead of signature object')
    }
  }
}

interface SignerAlgorithms {
  [alg: string]: SignerAlgorithm
}

const algorithms: SignerAlgorithms = {
  ES256: ES256SignerAlg(),
  ES256K: ES256KSignerAlg(),
  // This is a non-standard algorithm but retained for backwards compatibility
  // see https://github.com/decentralized-identity/did-jwt/issues/146
  'ES256K-R': ES256KSignerAlg(true),
  // This is actually incorrect but retained for backwards compatibility
  // see https://github.com/decentralized-identity/did-jwt/issues/130
  Ed25519: Ed25519SignerAlg(),
  EdDSA: Ed25519SignerAlg(),
}
/** */
function SignerAlg(alg: string): SignerAlgorithm {
  const impl: SignerAlgorithm = algorithms[alg]
  if (!impl) throw new Error(`not_supported: Unsupported algorithm ${alg}`)
  return impl
}

/**
 * Adds a new signing algorithm to the algorithm dictionary.
 * @param alg - The name of the algorithm to add.
 * @param impl - The implementation of the signing algorithm.
 * @throws {Error} If the algorithm name is invalid (empty or not a string).
 * @throws {Error} If the implementation is not a function.
 * @throws {Error} If the algorithm already exists in the dictionary.
 * @example
 */
export function AddSigningAlgorithm(alg: string, impl: SignerAlgorithm): void {
  if (!alg || typeof alg !== 'string') {
    throw new Error('Invalid algorithm name: must be a non-empty string')
  }

  if (!impl || typeof impl !== 'function') {
    throw new Error('Invalid implementation: must be a function')
  }

  if (alg in algorithms) {
    throw new Error(`Algorithm '${alg}' already exists`)
  }

  algorithms[alg] = impl
}

export default SignerAlg
