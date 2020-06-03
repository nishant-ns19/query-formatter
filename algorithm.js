const {
  TAB,
  NEW_LINE,
  // eslint-disable-next-line no-unused-vars
  RETURN,
  // eslint-disable-next-line no-unused-vars
  WHITESPACE,
  addNewlineTabs,
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
  // indicates whether the entire input is quoted
  let isQuoted = false;
  // indicates whether we are currently traversing the quoted text
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
        // in case next character is neither comma(,) nor colon(:),
        // move onto the next line
        if (idx >= query.length - 1 || !isCommaOrColon(query.charAt(idx + 1))) {
          result = result.concat(addNewlineTabs(tabCount));
        }
      }
      continue;
    }

    // quoted text should be printed as it is
    if (inPhrase) {
      result = result.concat(query.charAt(idx));
      // in case quoted text contains newline character, pointer should
      // move onto the next line but should not change the current block
      if (query.charAt(idx) === NEW_LINE) {
        result = result.concat(addNewlineTabs(tabCount, false));
      }
      // escaping character
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
        result = result.concat(addNewlineTabs(tabCount));
      }
      continue;
    }

    if (query.charAt(idx) === ":") {
      result = result.concat(": ");
      continue;
    }

    if (query.charAt(idx) === "," || isOpening(query.charAt(idx))) {
      // add a new block when opening bracket is encountered
      tabCount += isOpening(query.charAt(idx)) ? 1 : 0;
      result = result.concat(query.charAt(idx));
      result = result.concat(addNewlineTabs(tabCount));
      continue;
    }

    // end the current block whenever a closing paranthesis is encountered
    if (isClosing(query.charAt(idx))) {
      // if the cursor has already moved onto the next line,
      // remove TAB from end as cursor needs to go back to the previous block
      // otherwise, move onto the next line, get onto the previous block
      result =
        result.length > 1 && result.charAt(result.length - 1) === TAB
          ? result.substr(0, result.length - 1)
          : result.concat(addNewlineTabs(tabCount - 1));
      tabCount = Math.max(tabCount - 1, 0);
      result = result.concat(query.charAt(idx));

      if (idx >= query.length - 1 || !isCommaOrColon(query.charAt(idx + 1))) {
        result = result.concat(addNewlineTabs(tabCount));
      }
      continue;
    }

    // in any other case, just print the character
    result = result.concat(query.charAt(idx));
  }
  return result;
}

module.exports = {
  formatLuceneQuery,
};
