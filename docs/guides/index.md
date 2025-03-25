# Working with did-JWTs

## Creating a JWT

Use the `createJWT()` function

```js
import { createJWT, ES256KSigner } from 'did-jwt'

const signer = EdDSASigner('YOUR PRIVATE KEY')

createJWT(
  { aud: 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6', exp: 1485321133, name: 'Bob Smith' },
  { issuer: 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6', signer },
  { alg: 'EdDSA' }
).then((jwt) => {
  console.log(jwt)
})
```

### Parameters

```js
createJWT(payload, options, header)
```

| Name                | Description                                                                                                                                                  | Required |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `payload`           | an object containing any claims you want to encode in the JWT including optional standard claims such as `sub`, `aud` and `exp`                              | yes      |
| `options.issuer`    | The [DID](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) of the issuer of the JWT                                                       | yes      |
| `options.signer`    | A signing function (see [Signer functions](#signer-functions)) that corresponds to the `header.alg` algorithm that you choose.                               | yes      |
| `options.expiresIn` | How many seconds after signing should the JWT be valid (sets the `exp` claim)                                                                                | no       |
| `header`            | Object to inject custom headers, e.g. `alg` or `cty`. The default `alg` is `ES256K` in which case you need an [`ES256KSigner`](#es256ksigner) or equivalent. | no       |

### Promise Return Value

The `createJWT()` function returns a Promise.

A successful call returns an object containing the following attributes:

| Name  | Description                                                                      |
| ----- | -------------------------------------------------------------------------------- |
| `jwt` | String containing a [JSON Web Tokens (JWT)](https://tools.ietf.org/html/rfc7519) |

If there are any errors found during the signing process the promise is rejected with a clear error message.

## Verifying a JWT

Use the `verifyJWT()` function

```js
import { verifyJWT } from 'did-jwt'
import { Resolver } from 'did-resolver'

const resolver = new Resolver({...})

verifyJWT('eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6dXBvcn....', {
  resolver,
  audience: 'Your DID'
}).then(({ payload, doc, did, signer, jwt }) => {
  console.log(payload)
})
```

### Parameters

```js
verifyJWT(jwt, options)
```

| Name                  | Description                                                                                                                     | Required |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `jwt`                 | String containing a [JSON Web Tokens (JWT)](https://tools.ietf.org/html/rfc7519)                                                | yes      |
| `options.resolver`    | A `Resolvable` implementation that can resolve the issuer DID. See [did-resolver](https://github.com/decentralized-identity/did-resolver) | yes      |
| `options.auth`        | Require signer to be listed in the authentication section of the DID document (for Authentication of a user with DID-AUTH)      | no       |
| `options.audience`    | The [DID](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) of the audience of the JWT                        | no       |
| `options.callbackUrl` | The the URL receiving the JWT                                                                                                   | no       |

### Promise Return Value

The `verifyJWT()` function returns a Promise.

A successful call resolves to an object containing the following attributes:

| Name      | Description                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `payload` | An object containing the JSON parsed contents of the payload section of the JWT                                                       |
| `issuer`  | The [DID](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) of the issuer of the JWT                                |
| `signer`  | An object containing information about which key signed the JWT. This is useful if a DID document has multiple keys listed            |
| `doc`     | The [DID Document](https://w3c-ccg.github.io/did-spec/#did-documents) of the issuer of the JWT, as returned by the `options.resolver` |
| `jwt`     | The original JWT passed in to the function                                                                                            |

If there are any errors found during the verification process the promise is rejected with a clear error message.

## Signer Functions

We provide simple signing abstractions that make it easy to add support for your own Key Management infrastructure.

```typescript
type Signer = (data: string | Uint8Array) => Promise<string>
```

### ES256KSigner

You can use our `ES256KSigner()` function to create a signer function using a private key.
This signer function can be used with the `ES256K` algorithm.
The supported encodings for the private key are `hex`, `base64`, `base64url`, and `base58btc`.
You can also provide the private key bytes as a `Uint8Array`

Example using a `hex` encoded key:

```js
import { ES256KSigner } from 'did-jwt'
const signer: Signer = ES256KSigner('0x278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f')
```

#### Parameters

```typescript
function ES256KSigner(privateKey: Uint8Array | string, recoverable: Boolean = null): Signer {}
```

| Name          | Description                                                                                                                                          | Required |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `privateKey`  | A 32 byte [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) private key. Either `Uint8Array` or `string` with `hex`, `base64`, `base58btc` encoding. | yes      |
| `recoverable` | A flag indicating if the signature should include a recovery param. This is useful ONLY for backward compatibility with `ES256K-R`                   | no       |

Note that this is NOT a constructor, but a higher order function that returns a signing function (`Signer`).

### EdDSASigner

You can use our `EdDSASigner()` function to create a signer function using a private key.
The supported encodings for the private key are `hex`, `base64`, `base64url`, and `base58btc`.
You can also provide the private key bytes as a `Uint8Array`

Example using a `base58btc` encoded key:

```js
import { EdDSASigner } from 'did-jwt'
const signer: Signer = EdDSASigner(
  '4AcB6rb1mUBf82U7pBzPZ53ZAQycdi4Q1LWoUREvHSRXBRo9Sus9bzCJPKVTQQeDpjHMJN7fBAGWKEnJw5SPbaC4'
)
```

#### Parameters

```typescript
function EdDSASigner(secretKey: Uint8Array | string): Signer {}
```

| Name        | Description                                                                                                    | Required |
| ----------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| `secretKey` | A 64 byte Ed25519 secret key. Either as `Uint8Array` or a `hex`, `base64`, `base64url`, or `base58btc` string. | yes      |

Note this is NOT a constructor, but a higher order function that returns a signing function (`Signer`).

### Creating Custom Signers for integrating with HSM

You can easily create custom signers that integrates into your existing signing infrastructure.
A signer function takes the raw data to be signed and returns a Promise containing the signature string (`base64url` encoded).

```typescript
async function mySigner(data: Uint8Array | string): Promise<string> {
  const signatureBytes = await call.to.your.HSM.backend(data)
  return bytesToBase64url(signature)
}
```

#### Parameters

| Name   | Description                                           | Required |
| ------ | ----------------------------------------------------- | -------- |
| `data` | `string` or `Uint8Array` containing data to be signed | yes      |

#### Promise Return Value

Your function must returns a `Promise<string>`.

A successful call resolves to a `base64url`-encoded signature.


### Creating Signer objects

A signer object can be created using the SoftwareSigner class.

```js
import { SoftwareSigner } from 'did-jwt'
const signer: SoftwareSigner = new SoftwareSigner(EdDSASigner(
  '4AcB6rb1mUBf82U7pBzPZ53ZAQycdi4Q1LWoUREvHSRXBRo9Sus9bzCJPKVTQQeDpjHMJN7fBAGWKEnJw5SPbaC4'
), 'EdDSA')
```

This class can be used to sign JWTs in the same manner as with function signers
```js
createJWT(
  { aud: 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6', exp: 1485321133, name: 'Bob Smith' },
  { issuer: 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6', signer },
  { alg: 'EdDSA' }
).then((jwt) => {
  console.log(jwt)
})
```

### Creating Verifier objects

Verifier objects can be created:
```js
import { SoftwareVerifier } from 'did-jwt'
const verifier: SoftwareVerifier = new SoftwareVerifier()
```

The verifier can be used as a parameter in the verifyJWT function
```js
import { verifyJWT } from 'did-jwt'
import { Resolver } from 'did-resolver'

const resolver = new Resolver({...})

verifyJWT('eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6dXBvcn....', {
  resolver,
  audience: 'Your DID'
}, verifier).then(({ payload, doc, did, signer, jwt }) => {
  console.log(payload)
})
```
If no verifier is passed, the function will use a software verifier with the algorithms implemented in the library.

### Implementing custom signers and verifiers

Custom signers can be implemented by extending the class `AbstractSigner`

Custom implementations must implement the `supportedAlgorithms` with the algorithms that can be used with the signer. They also have to implement the sign method, returning the signature as a string.

```js
import { AbstractSigner } from 'did-jwt'

const supportedAlgorithms = ["TEST"]

class SampleSigner extends AbstractSigner {
    static supportedAlgorithms?: string[] = supportedAlgorithms
    constructor() {...}
    async sign (data: string | Uint8Array, algorithm: string): Promise<string> {...}
}
```

This signer can be used as a parameter in the `createJWT` function

Verifiers must extend the `AbstractVerifier` class, and must implement the `getSupportedVerificationMethods` and `verify` functions. `verify` must return the Verification Method that signed the JWT.

```js
import { AbstractVerifier } from 'did-jwt'

const verificationMethods: string[] = [
  'EcdsaSecp256k1RecoveryMethod2020'
]

class SampleVerifier extends AbstractVerifier {
  getSupportedVerificationMethods (alg?: string): string[] {
    if (alg === 'TEST') {
      return verificationMethods
    }
    return []
  }
  verify (
    alg: string,
    data: string,
    signature: string,
    authenticators: VerificationMethod[]
  ): VerificationMethod {...}
}
```
