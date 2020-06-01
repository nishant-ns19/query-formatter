// The module 'vscode' contains the VS Code extensibility API
const { window, commands, Range, Position, Selection } = require("vscode");
const vscode = require("vscode");
// this method is called when extension is activated

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // the command has been defined in the package.json file
  let disposable = commands.registerCommand(
    "query-formatter.start",
    function () {
      var editor = window.activeTextEditor;
      if (editor) {
        //retrieve current document
        const document = editor.document;
        if (!document) {
          window.showInformationMessage("No document detected");
        } else {
          const selection = editor.selection;
          //retrieve selected text and if nothing is selected, everything is retrieved
          const textSelection = selection.isEmpty
            ? document.getText().trim()
            : document.getText(selection).trim();
          if (!textSelection) {
            window.showInformationMessage("Please provide some text");
          } else {
            console.log("Indenting Lucene Query...");
            window.setStatusBarMessage("Indenting Lucene Query...", 1000);
            try {
              //format query
              var result = format(textSelection);
              if (result !== textSelection) {
                //use editor object to replace the text
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
                    //if nothing was selected by the user,deselect everything by moving cursor to the end after replacing the text
                    if (selection.isEmpty) {
                      var position = editor.selection.end;
                      editor.selection = new Selection(position, position);
                    }
                  });
              }
            } catch (error) {
              console.log("Error occurred: " + error);
              window.showInformationMessage("Unable to process text !");
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

/**
 * @param {string} query
 */
function format(query) {
  var result = "";
  var tabCount = 0;
  var isQuoted = false;
  //unquote the query
  if (
    query.charAt(0) == '"' &&
    query.charAt(query.length - 1) == '"' &&
    query.length >= 2
  ) {
    isQuoted = true;
    query = query.substr(1, query.length - 2);
    query = unescapeManual(query);
  }
  //inPhrase indicates whether we are traversing the quoted text
  var inPhrase = false;
  for (let idx = 0; idx < query.length; idx++) {
    // console.log(query.charAt(idx));
    if (query.charAt(idx) == '"') {
      //toggle inPhrase whenever ' " ' is encountered
      inPhrase = !inPhrase;
      result = result + query.charAt(idx);
      //jump onto the next line after completing each phrase(quoted text)
      if (!inPhrase) {
        result = result + "\n";
        result = result + "\t".repeat(tabCount);
      }
      continue;
    }
    //quoted text should be printed as it is
    if (inPhrase) {
      result = result + query.charAt(idx);
      //in case quoted text contains newline character, cursor should move onto the next line but should not change the current block
      if (query.charAt(idx) == "\n") {
        result = result + "\t".repeat(tabCount);
      } else if (query.charAt(idx) == "\\" && isQuoted) {
        if (idx + 1 < query.length) {
          result = result + query.charAt(idx + 1);
          idx++;
        }
      }
      continue;
    }
    //handling spacing characters in the string
    if (isSpacingCharacter(query.charAt(idx))) {
      if (
        result.charAt(result.length - 1) == "\t" ||
        result.charAt(result.length - 1) == "\n"
      ) {
        continue;
      } else {
        result = result + "\n";
        result = result + "\t".repeat(tabCount);
      }
    }
    //handle ',' separately
    else if (query.charAt(idx) == ",") {
      //append ','
      result = result + query.charAt(idx);
      //jump onto new line and respective indent block after each ','
      result = result + "\n";
      result = result + "\t".repeat(tabCount);
    }
    //start a new block whenever an opening paranthesis is encountered
    else if (isOpeningParanthesis(query.charAt(idx))) {
      result = result + query.charAt(idx);
      //jump onto new line
      result = result + "\n";
      //add a new block by increasing number of tabs
      tabCount++;
      result = result + "\t".repeat(tabCount);
    }
    //end the current block whenever a closing paranthesis is encountered
    else if (isClosingParanthesis(query.charAt(idx))) {
      //if the cursor has already moved onto the next line, remove '\t' from end as cursor needs to go back to the previous block
      if (result.charAt(result.length - 1) == "\t") {
        result = result.substr(0, result.length - 1);
      }
      //otherwise, move onto the next line, get onto the previous block
      else {
        result = result + "\n";
        result = result + "\t".repeat(tabCount - 1);
      }
      //decrement tabCount due to closing of the block
      tabCount--;
      result = result + query.charAt(idx);
      //incase there is a ',' after closing a block, it has to be printed just after closing so continue without moving onto the next line
      if (idx < query.length - 1 && query.charAt(idx + 1) == ",") {
        continue;
      }
      //otherwise, move onto the next line, jump onto the current block
      result = result + "\n";
      result = result + "\t".repeat(tabCount);
    }
    //in any other cases, just print the character
    else {
      result = result + query.charAt(idx);
    }
  }
  return result;
}

/**
 * @param {string} query
 */
function unescapeManual(query) {
  return query
    .replace(/\\\\/g, "\\") // backslash
    .replace(/\\\"/g, '"'); // closing quote character
}

function isOpeningParanthesis(ch) {
  if (ch == "(" || ch == "[" || ch == "{") {
    return true;
  } else {
    return false;
  }
}
function isClosingParanthesis(ch) {
  if (ch == ")" || ch == "]" || ch == "}") {
    return true;
  } else {
    return false;
  }
}
function isSpacingCharacter(ch) {
  if (ch == " " || ch == "\t" || ch == "\n" || ch == "\r") {
    return true;
  } else {
    return false;
  }
}
