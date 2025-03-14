const tests = [
  [-0x8000000000000000n, -2n, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -2n, -0x8000000000000000n],
  [-0x7ffffffffffffffen, -2n, -0x7ffffffffffffffen],
  [-0x100000001n, -2n, -0x100000002n],
  [-0x100000000n, -2n, -0x100000000n],
  [-0xffffffffn, -2n, -0x100000000n],
  [-0xfffffffen, -2n, -0xfffffffen],
  [-0x80000001n, -2n, -0x80000002n],
  [-0x80000000n, -2n, -0x80000000n],
  [-0x7fffffffn, -2n, -0x80000000n],
  [-0x7ffffffen, -2n, -0x7ffffffen],
  [-2n, -2n, -2n],
  [-1n, -2n, -2n],
  [0n, -2n, 0n],
  [1n, -2n, 0n],
  [2n, -2n, 2n],
  [0x7ffffffen, -2n, 0x7ffffffen],
  [0x7fffffffn, -2n, 0x7ffffffen],
  [0x80000000n, -2n, 0x80000000n],
  [0x80000001n, -2n, 0x80000000n],
  [0xfffffffen, -2n, 0xfffffffen],
  [0xffffffffn, -2n, 0xfffffffen],
  [0x100000000n, -2n, 0x100000000n],
  [0x100000001n, -2n, 0x100000000n],
  [0x7ffffffffffffffen, -2n, 0x7ffffffffffffffen],
  [0x7fffffffffffffffn, -2n, 0x7ffffffffffffffen],
  [-0x8000000000000000n, -1n, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -1n, -0x7fffffffffffffffn],
  [-0x7ffffffffffffffen, -1n, -0x7ffffffffffffffen],
  [-0x100000001n, -1n, -0x100000001n],
  [-0x100000000n, -1n, -0x100000000n],
  [-0xffffffffn, -1n, -0xffffffffn],
  [-0xfffffffen, -1n, -0xfffffffen],
  [-0x80000001n, -1n, -0x80000001n],
  [-0x80000000n, -1n, -0x80000000n],
  [-0x7fffffffn, -1n, -0x7fffffffn],
  [-0x7ffffffen, -1n, -0x7ffffffen],
  [-1n, -1n, -1n],
  [0n, -1n, 0n],
  [1n, -1n, 1n],
  [2n, -1n, 2n],
  [0x7ffffffen, -1n, 0x7ffffffen],
  [0x7fffffffn, -1n, 0x7fffffffn],
  [0x80000000n, -1n, 0x80000000n],
  [0x80000001n, -1n, 0x80000001n],
  [0xfffffffen, -1n, 0xfffffffen],
  [0xffffffffn, -1n, 0xffffffffn],
  [0x100000000n, -1n, 0x100000000n],
  [0x100000001n, -1n, 0x100000001n],
  [0x7ffffffffffffffen, -1n, 0x7ffffffffffffffen],
  [0x7fffffffffffffffn, -1n, 0x7fffffffffffffffn],
  [-0x8000000000000000n, 0n, 0n],
  [-0x7fffffffffffffffn, 0n, 0n],
  [-0x7ffffffffffffffen, 0n, 0n],
  [-0x100000001n, 0n, 0n],
  [-0x100000000n, 0n, 0n],
  [-0xffffffffn, 0n, 0n],
  [-0xfffffffen, 0n, 0n],
  [-0x80000001n, 0n, 0n],
  [-0x80000000n, 0n, 0n],
  [-0x7fffffffn, 0n, 0n],
  [-0x7ffffffen, 0n, 0n],
  [0n, 0n, 0n],
  [1n, 0n, 0n],
  [2n, 0n, 0n],
  [0x7ffffffen, 0n, 0n],
  [0x7fffffffn, 0n, 0n],
  [0x80000000n, 0n, 0n],
  [0x80000001n, 0n, 0n],
  [0xfffffffen, 0n, 0n],
  [0xffffffffn, 0n, 0n],
  [0x100000000n, 0n, 0n],
  [0x100000001n, 0n, 0n],
  [0x7ffffffffffffffen, 0n, 0n],
  [0x7fffffffffffffffn, 0n, 0n],
  [-0x8000000000000000n, 1n, 0n],
  [-0x7fffffffffffffffn, 1n, 1n],
  [-0x7ffffffffffffffen, 1n, 0n],
  [-0x100000001n, 1n, 1n],
  [-0x100000000n, 1n, 0n],
  [-0xffffffffn, 1n, 1n],
  [-0xfffffffen, 1n, 0n],
  [-0x80000001n, 1n, 1n],
  [-0x80000000n, 1n, 0n],
  [-0x7fffffffn, 1n, 1n],
  [-0x7ffffffen, 1n, 0n],
  [1n, 1n, 1n],
  [2n, 1n, 0n],
  [0x7ffffffen, 1n, 0n],
  [0x7fffffffn, 1n, 1n],
  [0x80000000n, 1n, 0n],
  [0x80000001n, 1n, 1n],
  [0xfffffffen, 1n, 0n],
  [0xffffffffn, 1n, 1n],
  [0x100000000n, 1n, 0n],
  [0x100000001n, 1n, 1n],
  [0x7ffffffffffffffen, 1n, 0n],
  [0x7fffffffffffffffn, 1n, 1n],
  [-0x8000000000000000n, 2n, 0n],
  [-0x7fffffffffffffffn, 2n, 0n],
  [-0x7ffffffffffffffen, 2n, 2n],
  [-0x100000001n, 2n, 2n],
  [-0x100000000n, 2n, 0n],
  [-0xffffffffn, 2n, 0n],
  [-0xfffffffen, 2n, 2n],
  [-0x80000001n, 2n, 2n],
  [-0x80000000n, 2n, 0n],
  [-0x7fffffffn, 2n, 0n],
  [-0x7ffffffen, 2n, 2n],
  [2n, 2n, 2n],
  [0x7ffffffen, 2n, 2n],
  [0x7fffffffn, 2n, 2n],
  [0x80000000n, 2n, 0n],
  [0x80000001n, 2n, 0n],
  [0xfffffffen, 2n, 2n],
  [0xffffffffn, 2n, 2n],
  [0x100000000n, 2n, 0n],
  [0x100000001n, 2n, 0n],
  [0x7ffffffffffffffen, 2n, 2n],
  [0x7fffffffffffffffn, 2n, 2n],
  [-0x8000000000000000n, 0x7ffffffen, 0n],
  [-0x7fffffffffffffffn, 0x7ffffffen, 0n],
  [-0x7ffffffffffffffen, 0x7ffffffen, 2n],
  [-0x100000001n, 0x7ffffffen, 0x7ffffffen],
  [-0x100000000n, 0x7ffffffen, 0n],
  [-0xffffffffn, 0x7ffffffen, 0n],
  [-0xfffffffen, 0x7ffffffen, 2n],
  [-0x80000001n, 0x7ffffffen, 0x7ffffffen],
  [-0x80000000n, 0x7ffffffen, 0n],
  [-0x7fffffffn, 0x7ffffffen, 0n],
  [-0x7ffffffen, 0x7ffffffen, 2n],
  [0x7ffffffen, 0x7ffffffen, 0x7ffffffen],
  [0x7fffffffn, 0x7ffffffen, 0x7ffffffen],
  [0x80000000n, 0x7ffffffen, 0n],
  [0x80000001n, 0x7ffffffen, 0n],
  [0xfffffffen, 0x7ffffffen, 0x7ffffffen],
  [0xffffffffn, 0x7ffffffen, 0x7ffffffen],
  [0x100000000n, 0x7ffffffen, 0n],
  [0x100000001n, 0x7ffffffen, 0n],
  [0x7ffffffffffffffen, 0x7ffffffen, 0x7ffffffen],
  [0x7fffffffffffffffn, 0x7ffffffen, 0x7ffffffen],
  [-0x8000000000000000n, 0x7fffffffn, 0n],
  [-0x7fffffffffffffffn, 0x7fffffffn, 1n],
  [-0x7ffffffffffffffen, 0x7fffffffn, 2n],
  [-0x100000001n, 0x7fffffffn, 0x7fffffffn],
  [-0x100000000n, 0x7fffffffn, 0n],
  [-0xffffffffn, 0x7fffffffn, 1n],
  [-0xfffffffen, 0x7fffffffn, 2n],
  [-0x80000001n, 0x7fffffffn, 0x7fffffffn],
  [-0x80000000n, 0x7fffffffn, 0n],
  [-0x7fffffffn, 0x7fffffffn, 1n],
  [-0x7ffffffen, 0x7fffffffn, 2n],
  [0x7fffffffn, 0x7fffffffn, 0x7fffffffn],
  [0x80000000n, 0x7fffffffn, 0n],
  [0x80000001n, 0x7fffffffn, 1n],
  [0xfffffffen, 0x7fffffffn, 0x7ffffffen],
  [0xffffffffn, 0x7fffffffn, 0x7fffffffn],
  [0x100000000n, 0x7fffffffn, 0n],
  [0x100000001n, 0x7fffffffn, 1n],
  [0x7ffffffffffffffen, 0x7fffffffn, 0x7ffffffen],
  [0x7fffffffffffffffn, 0x7fffffffn, 0x7fffffffn],
  [-0x8000000000000000n, 0x80000000n, 0n],
  [-0x7fffffffffffffffn, 0x80000000n, 0n],
  [-0x7ffffffffffffffen, 0x80000000n, 0n],
  [-0x100000001n, 0x80000000n, 0x80000000n],
  [-0x100000000n, 0x80000000n, 0n],
  [-0xffffffffn, 0x80000000n, 0n],
  [-0xfffffffen, 0x80000000n, 0n],
  [-0x80000001n, 0x80000000n, 0n],
  [-0x80000000n, 0x80000000n, 0x80000000n],
  [-0x7fffffffn, 0x80000000n, 0x80000000n],
  [-0x7ffffffen, 0x80000000n, 0x80000000n],
  [0x80000000n, 0x80000000n, 0x80000000n],
  [0x80000001n, 0x80000000n, 0x80000000n],
  [0xfffffffen, 0x80000000n, 0x80000000n],
  [0xffffffffn, 0x80000000n, 0x80000000n],
  [0x100000000n, 0x80000000n, 0n],
  [0x100000001n, 0x80000000n, 0n],
  [0x7ffffffffffffffen, 0x80000000n, 0x80000000n],
  [0x7fffffffffffffffn, 0x80000000n, 0x80000000n],
  [-0x8000000000000000n, 0x80000001n, 0n],
  [-0x7fffffffffffffffn, 0x80000001n, 1n],
  [-0x7ffffffffffffffen, 0x80000001n, 0n],
  [-0x100000001n, 0x80000001n, 0x80000001n],
  [-0x100000000n, 0x80000001n, 0n],
  [-0xffffffffn, 0x80000001n, 1n],
  [-0xfffffffen, 0x80000001n, 0n],
  [-0x80000001n, 0x80000001n, 1n],
  [-0x80000000n, 0x80000001n, 0x80000000n],
  [-0x7fffffffn, 0x80000001n, 0x80000001n],
  [-0x7ffffffen, 0x80000001n, 0x80000000n],
  [0x80000001n, 0x80000001n, 0x80000001n],
  [0xfffffffen, 0x80000001n, 0x80000000n],
  [0xffffffffn, 0x80000001n, 0x80000001n],
  [0x100000000n, 0x80000001n, 0n],
  [0x100000001n, 0x80000001n, 1n],
  [0x7ffffffffffffffen, 0x80000001n, 0x80000000n],
  [0x7fffffffffffffffn, 0x80000001n, 0x80000001n],
  [-0x8000000000000000n, -0x80000001n, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0x80000001n, -0x7fffffffffffffffn],
  [-0x7ffffffffffffffen, -0x80000001n, -0x7ffffffffffffffen],
  [-0x100000001n, -0x80000001n, -0x180000001n],
  [-0x100000000n, -0x80000001n, -0x100000000n],
  [-0xffffffffn, -0x80000001n, -0xffffffffn],
  [-0xfffffffen, -0x80000001n, -0xfffffffen],
  [-0x80000001n, -0x80000001n, -0x80000001n],
  [-0x80000000n, -0x80000001n, -0x100000000n],
  [-0x7fffffffn, -0x80000001n, -0xffffffffn],
  [-0x7ffffffen, -0x80000001n, -0xfffffffen],
  [0xfffffffen, -0x80000001n, 0x7ffffffen],
  [0xffffffffn, -0x80000001n, 0x7fffffffn],
  [0x100000000n, -0x80000001n, 0x100000000n],
  [0x100000001n, -0x80000001n, 0x100000001n],
  [0x7ffffffffffffffen, -0x80000001n, 0x7fffffff7ffffffen],
  [0x7fffffffffffffffn, -0x80000001n, 0x7fffffff7fffffffn],
  [-0x8000000000000000n, -0x80000000n, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0x80000000n, -0x8000000000000000n],
  [-0x7ffffffffffffffen, -0x80000000n, -0x8000000000000000n],
  [-0x100000001n, -0x80000000n, -0x180000000n],
  [-0x100000000n, -0x80000000n, -0x100000000n],
  [-0xffffffffn, -0x80000000n, -0x100000000n],
  [-0xfffffffen, -0x80000000n, -0x100000000n],
  [-0x80000000n, -0x80000000n, -0x80000000n],
  [-0x7fffffffn, -0x80000000n, -0x80000000n],
  [-0x7ffffffen, -0x80000000n, -0x80000000n],
  [0xfffffffen, -0x80000000n, 0x80000000n],
  [0xffffffffn, -0x80000000n, 0x80000000n],
  [0x100000000n, -0x80000000n, 0x100000000n],
  [0x100000001n, -0x80000000n, 0x100000000n],
  [0x7ffffffffffffffen, -0x80000000n, 0x7fffffff80000000n],
  [0x7fffffffffffffffn, -0x80000000n, 0x7fffffff80000000n],
  [-0x8000000000000000n, -0x7fffffffn, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0x7fffffffn, -0x7fffffffffffffffn],
  [-0x7ffffffffffffffen, -0x7fffffffn, -0x8000000000000000n],
  [-0x100000001n, -0x7fffffffn, -0x17fffffffn],
  [-0x100000000n, -0x7fffffffn, -0x100000000n],
  [-0xffffffffn, -0x7fffffffn, -0xffffffffn],
  [-0xfffffffen, -0x7fffffffn, -0x100000000n],
  [-0x7fffffffn, -0x7fffffffn, -0x7fffffffn],
  [-0x7ffffffen, -0x7fffffffn, -0x80000000n],
  [0xfffffffen, -0x7fffffffn, 0x80000000n],
  [0xffffffffn, -0x7fffffffn, 0x80000001n],
  [0x100000000n, -0x7fffffffn, 0x100000000n],
  [0x100000001n, -0x7fffffffn, 0x100000001n],
  [0x7ffffffffffffffen, -0x7fffffffn, 0x7fffffff80000000n],
  [0x7fffffffffffffffn, -0x7fffffffn, 0x7fffffff80000001n],
  [-0x8000000000000000n, -0x7ffffffen, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0x7ffffffen, -0x8000000000000000n],
  [-0x7ffffffffffffffen, -0x7ffffffen, -0x7ffffffffffffffen],
  [-0x100000001n, -0x7ffffffen, -0x17ffffffen],
  [-0x100000000n, -0x7ffffffen, -0x100000000n],
  [-0xffffffffn, -0x7ffffffen, -0x100000000n],
  [-0xfffffffen, -0x7ffffffen, -0xfffffffen],
  [-0x7ffffffen, -0x7ffffffen, -0x7ffffffen],
  [0xfffffffen, -0x7ffffffen, 0x80000002n],
  [0xffffffffn, -0x7ffffffen, 0x80000002n],
  [0x100000000n, -0x7ffffffen, 0x100000000n],
  [0x100000001n, -0x7ffffffen, 0x100000000n],
  [0x7ffffffffffffffen, -0x7ffffffen, 0x7fffffff80000002n],
  [0x7fffffffffffffffn, -0x7ffffffen, 0x7fffffff80000002n],
  [-0x8000000000000000n, 0xfffffffen, 0n],
  [-0x7fffffffffffffffn, 0xfffffffen, 0n],
  [-0x7ffffffffffffffen, 0xfffffffen, 2n],
  [-0x100000001n, 0xfffffffen, 0xfffffffen],
  [-0x100000000n, 0xfffffffen, 0n],
  [-0xffffffffn, 0xfffffffen, 0n],
  [-0xfffffffen, 0xfffffffen, 2n],
  [0xfffffffen, 0xfffffffen, 0xfffffffen],
  [0xffffffffn, 0xfffffffen, 0xfffffffen],
  [0x100000000n, 0xfffffffen, 0n],
  [0x100000001n, 0xfffffffen, 0n],
  [0x7ffffffffffffffen, 0xfffffffen, 0xfffffffen],
  [0x7fffffffffffffffn, 0xfffffffen, 0xfffffffen],
  [-0x8000000000000000n, 0xffffffffn, 0n],
  [-0x7fffffffffffffffn, 0xffffffffn, 1n],
  [-0x7ffffffffffffffen, 0xffffffffn, 2n],
  [-0x100000001n, 0xffffffffn, 0xffffffffn],
  [-0x100000000n, 0xffffffffn, 0n],
  [-0xffffffffn, 0xffffffffn, 1n],
  [-0xfffffffen, 0xffffffffn, 2n],
  [0xffffffffn, 0xffffffffn, 0xffffffffn],
  [0x100000000n, 0xffffffffn, 0n],
  [0x100000001n, 0xffffffffn, 1n],
  [0x7ffffffffffffffen, 0xffffffffn, 0xfffffffen],
  [0x7fffffffffffffffn, 0xffffffffn, 0xffffffffn],
  [-0x8000000000000000n, 0x100000000n, 0n],
  [-0x7fffffffffffffffn, 0x100000000n, 0n],
  [-0x7ffffffffffffffen, 0x100000000n, 0n],
  [-0x100000001n, 0x100000000n, 0n],
  [-0x100000000n, 0x100000000n, 0x100000000n],
  [-0xffffffffn, 0x100000000n, 0x100000000n],
  [-0xfffffffen, 0x100000000n, 0x100000000n],
  [0x100000000n, 0x100000000n, 0x100000000n],
  [0x100000001n, 0x100000000n, 0x100000000n],
  [0x7ffffffffffffffen, 0x100000000n, 0x100000000n],
  [0x7fffffffffffffffn, 0x100000000n, 0x100000000n],
  [-0x8000000000000000n, 0x100000001n, 0n],
  [-0x7fffffffffffffffn, 0x100000001n, 1n],
  [-0x7ffffffffffffffen, 0x100000001n, 0n],
  [-0x100000001n, 0x100000001n, 1n],
  [-0x100000000n, 0x100000001n, 0x100000000n],
  [-0xffffffffn, 0x100000001n, 0x100000001n],
  [-0xfffffffen, 0x100000001n, 0x100000000n],
  [0x100000001n, 0x100000001n, 0x100000001n],
  [0x7ffffffffffffffen, 0x100000001n, 0x100000000n],
  [0x7fffffffffffffffn, 0x100000001n, 0x100000001n],
  [-0x8000000000000000n, -0x100000001n, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0x100000001n, -0x7fffffffffffffffn],
  [-0x7ffffffffffffffen, -0x100000001n, -0x7ffffffffffffffen],
  [-0x100000001n, -0x100000001n, -0x100000001n],
  [-0x100000000n, -0x100000001n, -0x200000000n],
  [-0xffffffffn, -0x100000001n, -0x1ffffffffn],
  [-0xfffffffen, -0x100000001n, -0x1fffffffen],
  [0x7ffffffffffffffen, -0x100000001n, 0x7ffffffefffffffen],
  [0x7fffffffffffffffn, -0x100000001n, 0x7ffffffeffffffffn],
  [-0x8000000000000000n, -0x100000000n, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0x100000000n, -0x8000000000000000n],
  [-0x7ffffffffffffffen, -0x100000000n, -0x8000000000000000n],
  [-0x100000000n, -0x100000000n, -0x100000000n],
  [-0xffffffffn, -0x100000000n, -0x100000000n],
  [-0xfffffffen, -0x100000000n, -0x100000000n],
  [0x7ffffffffffffffen, -0x100000000n, 0x7fffffff00000000n],
  [0x7fffffffffffffffn, -0x100000000n, 0x7fffffff00000000n],
  [-0x8000000000000000n, -0xffffffffn, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0xffffffffn, -0x7fffffffffffffffn],
  [-0x7ffffffffffffffen, -0xffffffffn, -0x8000000000000000n],
  [-0xffffffffn, -0xffffffffn, -0xffffffffn],
  [-0xfffffffen, -0xffffffffn, -0x100000000n],
  [0x7ffffffffffffffen, -0xffffffffn, 0x7fffffff00000000n],
  [0x7fffffffffffffffn, -0xffffffffn, 0x7fffffff00000001n],
  [-0x8000000000000000n, -0xfffffffen, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0xfffffffen, -0x8000000000000000n],
  [-0x7ffffffffffffffen, -0xfffffffen, -0x7ffffffffffffffen],
  [-0xfffffffen, -0xfffffffen, -0xfffffffen],
  [0x7ffffffffffffffen, -0xfffffffen, 0x7fffffff00000002n],
  [0x7fffffffffffffffn, -0xfffffffen, 0x7fffffff00000002n],
  [-0x8000000000000000n, 0x7ffffffffffffffen, 0n],
  [-0x7fffffffffffffffn, 0x7ffffffffffffffen, 0n],
  [-0x7ffffffffffffffen, 0x7ffffffffffffffen, 2n],
  [0x7ffffffffffffffen, 0x7ffffffffffffffen, 0x7ffffffffffffffen],
  [0x7fffffffffffffffn, 0x7ffffffffffffffen, 0x7ffffffffffffffen],
  [-0x8000000000000000n, 0x7fffffffffffffffn, 0n],
  [-0x7fffffffffffffffn, 0x7fffffffffffffffn, 1n],
  [-0x7ffffffffffffffen, 0x7fffffffffffffffn, 2n],
  [0x7fffffffffffffffn, 0x7fffffffffffffffn, 0x7fffffffffffffffn],
  [-0x8000000000000000n, -0x8000000000000000n, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0x8000000000000000n, -0x8000000000000000n],
  [-0x7ffffffffffffffen, -0x8000000000000000n, -0x8000000000000000n],
  [-0x7fffffffffffffffn, -0x7fffffffffffffffn, -0x7fffffffffffffffn],
  [-0x7ffffffffffffffen, -0x7fffffffffffffffn, -0x8000000000000000n],
  [-0x7ffffffffffffffen, -0x7ffffffffffffffen, -0x7ffffffffffffffen],
];

function f(tests) {
  for (let test of tests) {
    let lhs = test[0], rhs = test[1], expected = test[2];
    assertEq(BigInt.asIntN(64, lhs), lhs);
    assertEq(BigInt.asIntN(64, rhs), rhs);
    assertEq(BigInt.asIntN(64, expected), expected);

    assertEq(lhs & rhs, expected);
    assertEq(rhs & lhs, expected);
  }
}

for (let i = 0; i < 10; ++i) {
  f(tests);
}
