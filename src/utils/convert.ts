import { StrKey, xdr } from "soroban-client";
import BigNumber from "bignumber.js";

export function scValToBigNumber(scval: xdr.ScVal | undefined): BigNumber {
  switch (scval?.switch()) {
    case undefined: {
      return new BigNumber(0);
    }
    case xdr.ScValType.scvU63(): {
      const { high, low } = scval.u63();
      return bigNumberFromBytes(false, high, low);
    }
    case xdr.ScValType.scvU32(): {
      return new BigNumber(scval.u32());
    }
    case xdr.ScValType.scvI32(): {
      return new BigNumber(scval.i32());
    }
    case xdr.ScValType.scvObject(): {
      let obj = scval.obj()!;
      switch (obj.switch()) {
        case xdr.ScObjectType.scoU64(): {
          const { high, low } = obj.u64();
          return bigNumberFromBytes(false, high, low);
        }
        case xdr.ScObjectType.scoI64(): {
          const { high, low } = obj.i64();
          return bigNumberFromBytes(true, high, low);
        }
        case xdr.ScObjectType.scoU128(): {
          const parts = obj.u128();
          const a = parts.hi();
          const b = parts.lo();
          return bigNumberFromBytes(false, a.high, a.low, b.high, b.low);
        }
        case xdr.ScObjectType.scoI128(): {
          const parts = obj.i128();
          const a = parts.hi();
          const b = parts.lo();
          return bigNumberFromBytes(true, a.high, a.low, b.high, b.low);
        }
        default:
          throw new Error(
            `Invalid type for scvalToBigNumber: ${obj.switch().name}`
          );
      }
    }
    default: {
      throw new Error(
        `Invalid type for scvalToBigNumber: ${scval?.switch().name}`
      );
    }
  }
}

function bigNumberFromBytes(
  signed: boolean,
  ...bytes: (string | number | bigint)[]
): BigNumber {
  let sign = 1;
  if (signed && bytes[0] === 0x80) {
    // top bit is set, negative number.
    sign = -1;
    bytes[0] &= 0x7f;
  }
  let b = BigInt(0);
  for (let byte of bytes) {
    b <<= BigInt(8);
    b |= BigInt(byte);
  }
  return new BigNumber(b.toString()).mul(sign);
}

export function bigNumberToI128(value: BigNumber): xdr.ScVal {
  const b: bigint = BigInt(value.toFixed(0));
  const buf = bigintToBuf(b);
  if (buf.length > 16) {
    throw new Error("BigNumber overflows i128");
  }

  if (value.isNegative()) {
    // Clear the top bit
    buf[0] &= 0x7f;
  }

  // left-pad with zeros up to 16 bytes
  let padded = Buffer.alloc(16);
  buf.copy(padded, padded.length - buf.length);

  if (value.isNegative()) {
    // Set the top bit
    padded[0] |= 0x80;
  }

  const hi = new xdr.Uint64(
    bigNumberFromBytes(false, ...padded.subarray(4, 8)).toNumber(),
    bigNumberFromBytes(false, ...padded.subarray(0, 4)).toNumber()
  );
  const lo = new xdr.Uint64(
    bigNumberFromBytes(false, ...padded.subarray(12, 16)).toNumber(),
    bigNumberFromBytes(false, ...padded.subarray(8, 12)).toNumber()
  );

  return xdr.ScVal.scvObject(
    xdr.ScObject.scoI128(new xdr.Int128Parts({ lo, hi }))
  );
}

function bigintToBuf(bn: bigint): Buffer {
  var hex = BigInt(bn).toString(16).replace(/^-/, "");
  if (hex.length % 2) {
    hex = "0" + hex;
  }

  var len = hex.length / 2;
  var u8 = new Uint8Array(len);

  var i = 0;
  var j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  if (bn < BigInt(0)) {
    // Set the top bit
    u8[0] |= 0x80;
  }

  return Buffer.from(u8);
}

export function xdrUint64ToNumber(value: xdr.Uint64): number {
  let b = 0;
  b |= value.high;
  b <<= 8;
  b |= value.low;
  return b;
}

export function scValToString(value: xdr.ScVal): string | undefined {
  return value.obj()?.bin().toString();
}

export function scValToAccountString(value: xdr.ScVal): string | undefined {
  const firstPart = value.obj()?.value();

  if (!Array.isArray(firstPart) || firstPart[1] instanceof xdr.ScMapEntry) {
    return undefined;
  }

  const buffer = firstPart[1].obj()?.accountId()?.ed25519();

  if (!(buffer instanceof Uint8Array)) {
    return undefined;
  }

  return StrKey.encodeEd25519PublicKey(buffer);
}

export function stringToAccountIdentifier(address: string): xdr.ScVal {
  return xdr.ScVal.scvObject(
    xdr.ScObject.scoVec([
      xdr.ScVal.scvSymbol("Account"),
      xdr.ScVal.scvObject(
        xdr.ScObject.scoAccountId(
          xdr.PublicKey.publicKeyTypeEd25519(
            StrKey.decodeEd25519PublicKey(address)
          )
        )
      ),
    ])
  );
}
