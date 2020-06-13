// The module 'vscode' contains the VS Code extensibility API
const { window, commands, Range, Position, Selection } = require("vscode");
// eslint-disable-next-line no-unused-vars
const vscode = require("vscode");
const { formatLuceneQuery } = require("./algorithm.js");

// this method is called when extension is activated
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // the command has been defined in the package.json file
  let disposable = commands.registerCommand(
    "query-formatter.start",
    function () {
      let editor = window.activeTextEditor;
      if (editor) {
        
        // retrieve current document
        const document = editor.document;
        if (!document) {
          window.showInformationMessage("No document detected");
        } else {
          const selection = editor.selection;
          
          // retrieve selected text and if nothing is selected, everything is retrieved
          const textSelection = selection.isEmpty
            ? document.getText().trim()
            : document.getText(selection).trim();

          if (!textSelection) {
            window.showInformationMessage("Please provide some text");
          } else {
            console.log("Indenting Lucene Query...");
            window.setStatusBarMessage("Indenting Lucene Query...", 1000);
            try {
              // format query
              let result = formatLuceneQuery(textSelection);
              if (result !== textSelection) {
                // console.log(JSON.stringify(textSelection));
                // console.log(JSON.stringify(result));
                // use editor object to replace the text
                editor
                  .edit((builder) =>
                    builder.replace(
                      selection.isEmpty
                        ? new Range(
                            new Position(0, 0),
                            new Position(document.lineCount, 0)
                          )
                        : selection,
                      result
                    )
                  )
                  .then((success) => {
                    console.log("Indented successfully: " + success);
                    window.showInformationMessage("Indented successfully !");
                    // if nothing was selected by the user,
                    // deselect everything by moving cursor to the end after replacing the text
                    if (selection.isEmpty) {
                      let position = editor.selection.end;
                      editor.selection = new Selection(position, position);
                    }
                  });
              }
            } catch (error) {
              console.log("Error occurred: " + error);
              window.showInformationMessage("Unable to process text due to " + error);
            }
          }
        }
      } else {
        window.showInformationMessage("No editor detected");
      }
    }
  );
  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
