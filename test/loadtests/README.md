### Load Tests

1. download the html action bundle: 
```console
$ cd dist/
$ wsk action get --save /helix-pages/6c8161919bbbff8cece81532d286de9f2ddf9542/html
ok: saved action code to test/loadtests/dist/html.zip
$ unzip html.zip
Archive:  html.zip
  inflating: package.json
  inflating: html.js
```
2. run the test with 256mb memory: 
```console
$ node --max-old-space-size=256 index.js
1 131178496
2 140517376
3 140042240
4 140042240
5 140042240
6 140042240
.
.
.
2197 361578496

<--- Last few GCs --->

[34769:0x10287f000]    96470 ms: Mark-sweep 230.3 (269.0) -> 225.0 (269.5) MB, 116.7 / 2.5 ms  (average mu = 0.256, current mu = 0.284) allocation failure scavenge might not succeed


<--- JS stacktrace --->

==== JS stack trace =========================================

    0: ExitFrame [pc: 0x5d165adbe3d]
    1: StubFrame [pc: 0x5d165add1b0]
Security context: 0x290ab2f1e6c1 <JSObject>
    2: /* anonymous */ [0x290a5dfe6e79] [/Users/tripod/codez/helix/helix-pages/test/loadtests/html.js:~9121] [pc=0x5d165df649c](this=0x290ac46f5c61 <Object map = 0x290acf4d9f99>,input=0x290acc4f84e9 <String[25]: raw.githubusercontent.com>)
    3: /* anonymous */ [0x290a5dfe8521] [/Users/tripod/codez/helix/helix-pages/test/...

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```
