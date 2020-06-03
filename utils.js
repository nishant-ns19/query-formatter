const TAB = "\t",
  NEW_LINE = "\n",
  WHITESPACE = " ",
  RETURN = "\r";

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
 * @param {number} count
 */
function addNewlineTabs(count, flag = true) {
  return flag
    ? NEW_LINE.concat(TAB.repeat(Math.max(count, 0)))
    : TAB.repeat(Math.max(count, 0));
}

/**
 * @param {string} ch
 */
function isCommaOrColon(ch) {
  if (ch === "," || ch === ":") return true;
  return false;
}

// function to remove unquoted multiple spaces in query
/**
 * @param {string} query
 * @param {boolean} isQuoted
 */
function removeMultipleSpaces(query, isQuoted) {
  let queryNew = "";
  let inPhrase = false;
  for (let idx = 0; idx < query.length; idx++) {
    queryNew = queryNew.concat(query.charAt(idx));
    if (query.charAt(idx) === '"') {
      // toggle inPhrase whenever ' " ' is encountered
      inPhrase = !inPhrase;
      continue;
    }

    if (inPhrase) {
      // unescaping character
      if (query.charAt(idx) === "\\" && isQuoted && idx < query.length - 1) {
        queryNew = queryNew.concat(query.charAt(idx + 1));
        idx++;
      }
      continue;
    }
    // 'queryNew = queryNew.substr(0, queryNew.length - 1)' is used to
    // remove complete space sequence when found around a comma or colon
    if (isSpacingCharacter(query.charAt(idx))) {
      if (idx - 1 >= 0 && isCommaOrColon(query.charAt(idx - 1))) {
        queryNew = queryNew.substr(0, queryNew.length - 1);
      }

      while (idx < query.length && isSpacingCharacter(query.charAt(idx))) {
        idx++;
      }

      if (idx < query.length && isCommaOrColon(query.charAt(idx))) {
        queryNew = queryNew.substr(0, queryNew.length - 1);
      }
      idx--;
    }
  }
  return queryNew;
}

module.exports = {
  TAB,
  NEW_LINE,
  RETURN,
  WHITESPACE,
  addNewlineTabs,
  isClosing,
  isOpening,
  isCommaOrColon,
  unescapeManual,
  isSpacingCharacter,
  removeMultipleSpaces,
};
