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
function addNewlineTab(count, flag = true) {
  return flag
    ? NEW_LINE.concat(TAB.repeat(Math.max(count, 0)))
    : TAB.repeat(Math.max(count, 0));
}

module.exports = {
  TAB,
  NEW_LINE,
  RETURN,
  WHITESPACE,
  addNewlineTab,
  isClosing,
  isOpening,
  unescapeManual,
  isSpacingCharacter,
};
