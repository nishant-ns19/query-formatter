const assert = require("assert");
const { input, expectedOutput } = require("./testSet");
const { formatLuceneQuery } = require("../../algorithm.js");
const vscode = require("vscode");
const { before, after } = require("mocha");

suite("Extension Test Suite", () => {
  before(() => {
    vscode.window.showInformationMessage("Tests started!");
  });
  test("compare length of input and expected output", () => {
    assert.equal(input.length, expectedOutput.length);
  });

  for (let i = 0; i < input.length; i++) {
    test("Sample test " + i, () => {
      assert.equal(expectedOutput[i], formatLuceneQuery(input[i]));
    });
  }
  after(() => {
    vscode.window.showInformationMessage("All tests done!");
  });
});
