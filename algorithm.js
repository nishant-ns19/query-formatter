const TAB = "\t";
const NEW_LINE = "\n";
const WHITESPACE = " ";
const RETURN = "\r";
/**
 * @param {string} query
 */
function format(query) {
  let result = "";
  let tabCount = 0;
  let isQuoted = false;
  //unquote the query
  if (
    query.charAt(0) === '"' &&
    query.charAt(query.length - 1) === '"' &&
    query.length >= 2
  ) {
    isQuoted = true;
    query = query.substr(1, query.length - 2);
    query = unescapeManual(query);
  }
  //inPhrase indicates whether we are traversing the quoted text
  let inPhrase = false;
  for (let idx = 0; idx < query.length; idx++) {
    // console.log(query.charAt(idx));
    if (query.charAt(idx) === '"') {
      //toggle inPhrase whenever ' " ' is encountered
      inPhrase = !inPhrase;
      result = result + query.charAt(idx);
      //jump onto the next line after completing each phrase(quoted text)
      if (!inPhrase) {
        result = result + NEW_LINE;
        result = addTabs(result, tabCount);
      }
      continue;
    }
    //quoted text should be printed as it is
    if (inPhrase) {
      result = result + query.charAt(idx);
      //in case quoted text contains newline character, cursor should move onto the next line but should not change the current block
      if (query.charAt(idx) === NEW_LINE) {
        result = addTabs(result, tabCount);
      } else if (query.charAt(idx) === "\\" && isQuoted) {
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
        result.charAt(result.length - 1) === TAB ||
        result.charAt(result.length - 1) === NEW_LINE
      ) {
        continue;
      } else {
        result = result + NEW_LINE;
        result = addTabs(result, tabCount);
      }
    }
    //handle ',' separately
    else if (query.charAt(idx) === ",") {
      //append ','
      result = result + query.charAt(idx);
      //jump onto new line and respective indent block after each ','
      result = result + NEW_LINE;
      result = addTabs(result, tabCount);
    }
    //start a new block whenever an opening paranthesis is encountered
    else if (isOpening(query.charAt(idx))) {
      result = result + query.charAt(idx);
      //jump onto new line
      result = result + NEW_LINE;
      //add a new block by increasing number of tabs
      tabCount++;
      result = addTabs(result, tabCount);
    }
    //end the current block whenever a closing paranthesis is encountered
    else if (isClosing(query.charAt(idx))) {
      //if the cursor has already moved onto the next line, remove '\t' from end as cursor needs to go back to the previous block
      if (result.length > 1 && result.charAt(result.length - 1) === TAB) {
        result = result.substr(0, result.length - 1);
      }
      //otherwise, move onto the next line, get onto the previous block
      else {
        result = result + NEW_LINE;
        result = addTabs(result, tabCount - 1);
      }
      //decrement tabCount due to closing of the block
      tabCount = Math.max(tabCount - 1, 0);
      result = result + query.charAt(idx);
      //incase there is a ',' after closing a block, it has to be printed just after closing so continue without moving onto the next line
      if (idx < query.length - 1 && query.charAt(idx + 1) === ",") {
        continue;
      }
      //otherwise, move onto the next line, jump onto the current block
      result = result + NEW_LINE;
      result = result + TAB.repeat(tabCount);
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
    .replace(/\\\"/g, '"'); // quote character
}

/**
 * @param {string} bracket
 */
function isOpening(bracket) {
  if (bracket === "(" || bracket === "[" || bracket === "{") return true;
  return false;
}

/**
 * @param {string} bracket
 */
function isClosing(bracket) {
  if (bracket === ")" || bracket === "]" || bracket === "}") return true;
  return false;
}

/**
 * @param {string} ch
 */
function isSpacingCharacter(ch) {
  if (ch === WHITESPACE || ch === TAB || ch === NEW_LINE || ch == RETURN)
    return true;
  return false;
}

/**
 * @param {string} result
 * @param {number} count
 */
function addTabs(result, count) {
  if (count < 0) return result;
  return result + TAB.repeat(count);
}

module.exports = {
  format,
};
