// |reftest| error:SyntaxError
// Copyright 2024 Mathias Bynens. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
author: Mathias Bynens
description: >
  Negating Unicode property escapes for `RGI_Emoji` (property of strings) with `\P{…}` throws an early error.
info: |
  Generated by https://github.com/mathiasbynens/unicode-property-escapes-tests
  Unicode v16.0.0
esid: sec-isvalidregularexpressionliteral
features: [regexp-unicode-property-escapes, regexp-v-flag]
negative:
  phase: parse
  type: SyntaxError
---*/

$DONOTEVALUATE();

/\P{RGI_Emoji}/v;
