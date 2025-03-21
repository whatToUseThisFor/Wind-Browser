// |jit-test| --setpref=wasm_relaxed_simd=true; skip-if: !wasmRelaxedSimdEnabled()
/* Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// ./test/core/relaxed-simd/relaxed_dot_product.wast

// ./test/core/relaxed-simd/relaxed_dot_product.wast:4
let $0 = instantiate(`(module
    (func (export "i16x8.relaxed_dot_i8x16_i7x16_s") (param v128 v128) (result v128) (i16x8.relaxed_dot_i8x16_i7x16_s (local.get 0) (local.get 1)))
    (func (export "i32x4.relaxed_dot_i8x16_i7x16_add_s") (param v128 v128 v128) (result v128) (i32x4.relaxed_dot_i8x16_i7x16_add_s (local.get 0) (local.get 1) (local.get 2)))

    (func (export "i16x8.relaxed_dot_i8x16_i7x16_s_cmp") (param v128 v128) (result v128)
          (i16x8.eq
            (i16x8.relaxed_dot_i8x16_i7x16_s (local.get 0) (local.get 1))
            (i16x8.relaxed_dot_i8x16_i7x16_s (local.get 0) (local.get 1))))
    (func (export "i32x4.relaxed_dot_i8x16_i7x16_add_s_cmp") (param v128 v128 v128) (result v128)
          (i16x8.eq
            (i32x4.relaxed_dot_i8x16_i7x16_add_s (local.get 0) (local.get 1) (local.get 2))
            (i32x4.relaxed_dot_i8x16_i7x16_add_s (local.get 0) (local.get 1) (local.get 2))))
)`);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:19
assert_return(
  () => invoke($0, `i16x8.relaxed_dot_i8x16_i7x16_s`, [
    i8x16([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf]),
    i8x16([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf]),
  ]),
  [i16x8([0x1, 0xd, 0x29, 0x55, 0x91, 0xdd, 0x139, 0x1a5])],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:25
assert_return(
  () => invoke($0, `i16x8.relaxed_dot_i8x16_i7x16_s`, [
    i8x16([0x80, 0x80, 0x7f, 0x7f, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i8x16([0x7f, 0x7f, 0x7f, 0x7f, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
  ]),
  [i16x8([0x8100, 0x7e02, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0])],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:33
assert_return(
  () => invoke($0, `i16x8.relaxed_dot_i8x16_i7x16_s`, [
    i8x16([0x80, 0x80, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i8x16([0x81, 0x81, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
  ]),
  [
    either(
      i16x8([0x8000, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
      i16x8([0x7f00, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
      i16x8([0x8100, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    ),
  ],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:42
assert_return(
  () => invoke($0, `i32x4.relaxed_dot_i8x16_i7x16_add_s`, [
    i8x16([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf]),
    i8x16([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf]),
    i32x4([0x0, 0x1, 0x2, 0x3]),
  ]),
  [i32x4([0xe, 0x7f, 0x170, 0x2e1])],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:50
assert_return(
  () => invoke($0, `i32x4.relaxed_dot_i8x16_i7x16_add_s`, [
    i8x16([0x80, 0x80, 0x80, 0x80, 0x7f, 0x7f, 0x7f, 0x7f, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i8x16([0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i32x4([0x1, 0x2, 0x3, 0x4]),
  ]),
  [i32x4([0xffff0201, 0xfc06, 0x3, 0x4])],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:63
assert_return(
  () => invoke($0, `i32x4.relaxed_dot_i8x16_i7x16_add_s`, [
    i8x16([0x80, 0x80, 0x80, 0x80, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i8x16([0x81, 0x81, 0x81, 0x81, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i32x4([0x1, 0x2, 0x3, 0x4]),
  ]),
  [
    either(
      i32x4([0xfffefe01, 0x2, 0x3, 0x4]),
      i32x4([0xffff0001, 0x2, 0x3, 0x4]),
      i32x4([0xfe01, 0x2, 0x3, 0x4]),
      i32x4([0x10201, 0x2, 0x3, 0x4]),
    ),
  ],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:76
assert_return(
  () => invoke($0, `i16x8.relaxed_dot_i8x16_i7x16_s_cmp`, [
    i8x16([0x80, 0x80, 0x7f, 0x7f, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i8x16([0x7f, 0x7f, 0x7f, 0x7f, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
  ]),
  [i16x8([0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff])],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:82
assert_return(
  () => invoke($0, `i32x4.relaxed_dot_i8x16_i7x16_add_s_cmp`, [
    i8x16([0x80, 0x80, 0x80, 0x80, 0x7f, 0x7f, 0x7f, 0x7f, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i8x16([0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i32x4([0x1, 0x2, 0x3, 0x4]),
  ]),
  [i32x4([0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff])],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:92
assert_return(
  () => invoke($0, `i16x8.relaxed_dot_i8x16_i7x16_s_cmp`, [
    i8x16([0x80, 0x80, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i8x16([0x81, 0x81, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
  ]),
  [i16x8([0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff])],
);

// ./test/core/relaxed-simd/relaxed_dot_product.wast:103
assert_return(
  () => invoke($0, `i32x4.relaxed_dot_i8x16_i7x16_add_s_cmp`, [
    i8x16([0x80, 0x80, 0x80, 0x80, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i8x16([0x81, 0x81, 0x81, 0x81, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
    i32x4([0x1, 0x2, 0x3, 0x4]),
  ]),
  [i32x4([0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff])],
);
