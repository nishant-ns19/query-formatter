const assert = require("assert");
const { input, output } = require("./testSet");
const { formatLuceneQuery } = require("../../algorithm.js");
const vscode = require("vscode");
const { before, after } = require("mocha");

suite("Extension Test Suite", () => {
  before(() => {
    vscode.window.showInformationMessage("Tests started!");
  });
  assert.equal(input.length, output.length)
  for (let i = 0; i < input.length; i++) {
    test("Sample test " + i, () => {
      assert.equal(output[i], formatLuceneQuery(input[i]));
    });
  }
  after(() => {
    vscode.window.showInformationMessage("All tests done!");
  });
});
