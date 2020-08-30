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
2. start the mock server
```console
$ node server.js
```
3. run the test with 70mb memory: 
```console
$ NODE_HEAPDUMP_OPTIONS=nosignal node --max-old-space-size=90 --expose-gc index.js
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
    2: /* anonymous */ [0x290a5dfe6e79] [helix-pages/test/loadtests/html.js:~9121] [pc=0x5d165df649c](this=0x290ac46f5c61 <Object map = 0x290acf4d9f99>,input=0x290acc4f84e9 <String[25]: raw.githubusercontent.com>)
    3: /* anonymous */ [0x290a5dfe8521] [helix-pages/test/...

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

### Results

- running with nock quickly shows an OOME
- running without nock and 70mb memory runs OOME after 1217 requests (http localhost, 20 concurrent, 404 for github, 200 for content proxy)
- enabling epsagon traces uses more memory. using 80mb heap, runs w/o problems for 4000 requests
- enabling coralogix doesn't change much

### Conclusion:

I don't think there is a memory leak. What affects the memory most is of course concurrency.
The most likely reason for the process to run out of memory, is then the concurrency is too
high.

