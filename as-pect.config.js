/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
module.exports = {
  /**
   * A set of globs passed to the glob package that qualify typescript files for testing.
   */
  include: ['test/assembly/**/*.spec.ts'],
  /**
   * A set of globs passed to the glob package that quality files to be added to each test.
   */
  add: ['test/assembly/**/*.include.ts'],
  /**
   * All the compiler flags needed for this test suite. Make sure that a binary file is output.
   */
  flags: {
    /** To output a wat file, uncomment the following line. */
    // "--textFile": ["output.wat"],
    /** A runtime must be provided here. */
    '--runtime': ['full'], // Acceptable values are: full, half, stub (arena), and none
  },
  /**
   * A set of regexp that will disclude source files from testing.
   */
  disclude: [/node_modules/],
  /**
   * Add your required AssemblyScript imports here.
   */
  imports(memory, createImports, instantiateSync, binary) {
    const myImports = {
      // put your web assembly imports here, and return the module
    };
    const instance = instantiateSync(binary, createImports(myImports));
    return instance;
  },
  /**
   * Add a custom reporter here if you want one. The following example is in typescript.
   *
   * @example
   * import { TestReporter, TestGroup, TestResult, TestContext } from "as-pect";
   *
   * export class CustomReporter extends TestReporter {
   *   // implement each abstract method here
   *   public abstract onStart(suite: TestContext): void;
   *   public abstract onGroupStart(group: TestGroup): void;
   *   public abstract onGroupFinish(group: TestGroup): void;
   *   public abstract onTestStart(group: TestGroup, result: TestResult): void;
   *   public abstract onTestFinish(group: TestGroup, result: TestResult): void;
   *   public abstract onFinish(suite: TestContext): void;
   * }
   */
  // reporter: new CustomReporter(),
  /**
   * Specify if the binary wasm file should be written to the file system.
   */
  outputBinary: false,
};
