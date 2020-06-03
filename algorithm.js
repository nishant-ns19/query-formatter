const {
  TAB,
  NEW_LINE,
  // eslint-disable-next-line no-unused-vars
  RETURN,
  // eslint-disable-next-line no-unused-vars
  WHITESPACE,
  addNewlineTab,
  isClosing,
  isOpening,
  unescapeManual,
  isSpacingCharacter,
  isCommaOrColon,
  removeMultipleSpaces,
} = require("./utils.js");

/**
 * @param {string} query
 */
function formatLuceneQuery(query) {
  let result = "";
  let tabCount = 0;
  // true if complete input is quoted
  let isQuoted = false;
  // inPhrase indicates whether we are currently traversing the quoted text
  let inPhrase = false;
  // unquote the query
  if (
    query.charAt(0) === '"' &&
    query.charAt(query.length - 1) === '"' &&
    query.length >= 2
  ) {
    isQuoted = true;
    query = query.substr(1, query.length - 2);
    query = unescapeManual(query);
  }
  query = removeMultipleSpaces(query, isQuoted);
  for (let idx = 0; idx < query.length; idx++) {
    if (query.charAt(idx) === '"') {
      // toggle inPhrase whenever ' " ' is encountered
      inPhrase = !inPhrase;
      result = result.concat(query.charAt(idx));
      // jump onto the next line after completing each quoted text segment
      if (!inPhrase) {
        if (idx >= query.length - 1 || !isCommaOrColon(query.charAt(idx + 1))) {
          result = result.concat(addNewlineTab(tabCount));
        }
      }
      continue;
    }

    // quoted text should be printed as it is
    if (inPhrase) {
      result = result.concat(query.charAt(idx));
      // in case quoted text contains newline character,
      // cursor should move onto the next line but should not change the current block
      if (query.charAt(idx) === NEW_LINE) {
        result = result.concat(addNewlineTab(tabCount, false));
      }
      // unescape characters when query retrieved is quoted
      else if (
        query.charAt(idx) === "\\" &&
        isQuoted &&
        idx < query.length - 1
      ) {
        result = result.concat(query.charAt(idx + 1));
        idx++;
      }
      continue;
    }

    // handling spacing characters in the string
    if (isSpacingCharacter(query.charAt(idx))) {
      if (
        result.charAt(result.length - 1) === TAB ||
        result.charAt(result.length - 1) === NEW_LINE
      ) {
        continue;
      } else {
        result = result.concat(addNewlineTab(tabCount));
      }
      continue;
    }

    if (query.charAt(idx) === ":") {
      result = result.concat(": ");
      continue;
    }

    if (query.charAt(idx) === "," || isOpening(query.charAt(idx))) {
      //add a new block when opening bracket is encountered
      tabCount = tabCount + (isOpening(query.charAt(idx)) ? 1 : 0);
      result = result.concat(query.charAt(idx));
      result = result.concat(addNewlineTab(tabCount));
      continue;
    }
    // end the current block whenever a closing paranthesis is encountered
    if (isClosing(query.charAt(idx))) {
      // if the cursor has already moved onto the next line,
      // remove TAB from end as cursor needs to go back to the previous block
      result =
        result.length > 1 && result.charAt(result.length - 1) === TAB
          ? result.substr(0, result.length - 1)
          : result.concat(addNewlineTab(tabCount - 1));

      tabCount = Math.max(tabCount - 1, 0);
      result = result.concat(query.charAt(idx));
      // incase there is a ',' after closing a block, it has to be printed just
      // after closing so continue without moving onto the next line
      if (idx >= query.length - 1 || !isCommaOrColon(query.charAt(idx + 1))) {
        result = result.concat(addNewlineTab(tabCount));
      }
      continue;
    }
    // in any other cases, just print the character
    result = result.concat(query.charAt(idx));
  }
  return result;
}

module.exports = {
  formatLuceneQuery,
};
