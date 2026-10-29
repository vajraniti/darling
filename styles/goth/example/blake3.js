// BLAKE3 in plain JavaScript — a direct port of the official reference
// implementation (reference_impl.rs, CC0). Small inputs only; no SIMD, no threads.
// Checked against test_vectors.json from the BLAKE3 repository (all 35 lengths, 3 modes).
(function (root) {
  const IV = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
  const PERM = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8];
  const CHUNK_START = 1, CHUNK_END = 2, PARENT = 4, ROOT = 8, KEYED_HASH = 16, DERIVE_KEY_CONTEXT = 32, DERIVE_KEY_MATERIAL = 64;
  const BLOCK_LEN = 64, CHUNK_LEN = 1024;

  const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;

  function g(s, a, b, c, d, mx, my) {
    s[a] = (s[a] + s[b] + mx) >>> 0; s[d] = rotr(s[d] ^ s[a], 16);
    s[c] = (s[c] + s[d]) >>> 0;      s[b] = rotr(s[b] ^ s[c], 12);
    s[a] = (s[a] + s[b] + my) >>> 0; s[d] = rotr(s[d] ^ s[a], 8);
    s[c] = (s[c] + s[d]) >>> 0;      s[b] = rotr(s[b] ^ s[c], 7);
  }

  function round(s, m) {
    g(s, 0, 4, 8, 12, m[0], m[1]);  g(s, 1, 5, 9, 13, m[2], m[3]);
    g(s, 2, 6, 10, 14, m[4], m[5]); g(s, 3, 7, 11, 15, m[6], m[7]);
    g(s, 0, 5, 10, 15, m[8], m[9]); g(s, 1, 6, 11, 12, m[10], m[11]);
    g(s, 2, 7, 8, 13, m[12], m[13]); g(s, 3, 4, 9, 14, m[14], m[15]);
  }

  // trace, if given, receives the 16-word state before round 1 and after each of the 7 rounds.
  function compress(cv, block, counter, blockLen, flags, trace) {
    const s = [cv[0], cv[1], cv[2], cv[3], cv[4], cv[5], cv[6], cv[7],
      IV[0], IV[1], IV[2], IV[3],
      counter >>> 0, Math.floor(counter / 0x100000000) >>> 0, blockLen >>> 0, flags >>> 0];
    let m = block.slice();
    if (trace) trace.push(s.slice());
    for (let r = 0; r < 7; r++) {
      round(s, m);
      if (trace) trace.push(s.slice());
      if (r < 6) m = PERM.map(i => m[i]);
    }
    for (let i = 0; i < 8; i++) {
      s[i] = (s[i] ^ s[i + 8]) >>> 0;
      s[i + 8] = (s[i + 8] ^ cv[i]) >>> 0;
    }
    return s;
  }

  function wordsLE(bytes, n) {
    const w = new Array(n).fill(0);
    for (let i = 0; i < bytes.length; i++) w[i >> 2] |= bytes[i] << (8 * (i & 3));
    return w.map(x => x >>> 0);
  }

  const cvOf = o => compress(o.cv, o.block, o.counter, o.blockLen, o.flags).slice(0, 8);

  function chunkOutput(keyWords, chunk, counter, flags) {
    const nBlocks = Math.max(1, Math.ceil(chunk.length / BLOCK_LEN));
    let cv = keyWords;
    for (let i = 0; i < nBlocks - 1; i++) {
      const block = wordsLE(chunk.subarray(i * BLOCK_LEN, (i + 1) * BLOCK_LEN), 16);
      cv = compress(cv, block, counter, BLOCK_LEN, flags | (i === 0 ? CHUNK_START : 0)).slice(0, 8);
    }
    const last = chunk.subarray((nBlocks - 1) * BLOCK_LEN);
    return {
      cv, block: wordsLE(last, 16), counter, blockLen: last.length,
      flags: flags | (nBlocks === 1 ? CHUNK_START : 0) | CHUNK_END
    };
  }

  function parentOutput(left, right, keyWords, flags) {
    return { cv: keyWords, block: left.concat(right), counter: 0, blockLen: BLOCK_LEN, flags: flags | PARENT };
  }

  function rootBytes(o, outLen, trace) {
    const out = new Uint8Array(outLen);
    for (let b = 0, pos = 0; pos < outLen; b++) {
      const words = compress(o.cv, o.block, b, o.blockLen, o.flags | ROOT, b === 0 ? trace : null);
      for (let i = 0; i < 16 && pos < outLen; i++)
        for (let k = 0; k < 4 && pos < outLen; k++) out[pos++] = (words[i] >>> (8 * k)) & 255;
    }
    return out;
  }

  // The tree is left-balanced: each completed pair of subtrees is merged at once (Section 5.1.2 of the spec).
  function hashInternal(input, keyWords, flags, outLen, trace) {
    const nChunks = Math.max(1, Math.ceil(input.length / CHUNK_LEN));
    const stack = [];
    for (let c = 0; c < nChunks - 1; c++) {
      let cv = cvOf(chunkOutput(keyWords, input.subarray(c * CHUNK_LEN, (c + 1) * CHUNK_LEN), c, flags));
      let total = c + 1;
      while ((total & 1) === 0) { cv = cvOf(parentOutput(stack.pop(), cv, keyWords, flags)); total = total / 2; }
      stack.push(cv);
    }
    let o = chunkOutput(keyWords, input.subarray((nChunks - 1) * CHUNK_LEN), nChunks - 1, flags);
    for (let i = stack.length - 1; i >= 0; i--) o = parentOutput(stack[i], cvOf(o), keyWords, flags);
    return rootBytes(o, outLen, trace);
  }

  const enc = s => (typeof s === 'string' ? new TextEncoder().encode(s) : s);
  const hex = b => Array.from(b, x => x.toString(16).padStart(2, '0')).join('');

  const blake3 = {
    hash: (input, outLen = 32, trace) => hashInternal(enc(input), IV, 0, outLen, trace),
    keyedHash: (key, input, outLen = 32) => hashInternal(enc(input), wordsLE(enc(key), 8), KEYED_HASH, outLen),
    deriveKey: (context, material, outLen = 32) => {
      const ctxKey = hashInternal(enc(context), IV, DERIVE_KEY_CONTEXT, 32);
      return hashInternal(enc(material), wordsLE(ctxKey, 8), DERIVE_KEY_MATERIAL, outLen);
    },
    hex,
    CHUNK_LEN, BLOCK_LEN
  };
  if (typeof module !== 'undefined') module.exports = blake3; else root.blake3 = blake3;
})(this);
