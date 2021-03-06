/**
 *
 * @param {String} selector
 * @param {HTMLElement} parentTree
 * @returns
 */
export const $select = (selector, tree = document.body) => tree.querySelector(selector);

/**
*
* @param {String} selector
* @param {HTMLElement} parentTree
* @returns
*/
export const $selectAll = (selector, tree = document.body) => tree.querySelectorAll(selector);

/**
*
* @param {HTMLElement} element
* @param {String} attribute
* @param {String | Boolean | undefined} value
* @returns
*/
export const $attrib = (element, attribute, value) => {
  if (value === undefined) return element.getAttribute(attribute);

  element.setAttribute(attribute, value);
};

/**
*
* @param {HTMLElement} element
* @param {String} attribute
* @returns
*/
export const $is = (element, attribute) => element.hasAttribute(attribute);

/**
*
* @param {HTMLElement} element
* @param {String} attribute
* @returns
*/
export const $prop = (element, attribute) => element.removeAttribute(attribute);

/**
*
* @param {String} tagName
* @returns
*/
export const createElement = (tagName) => document.createElement(tagName);
