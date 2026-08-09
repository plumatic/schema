/*TRANSPILED*/goog.loadModule(function(exports) {'use strict';/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
goog.module("goog.labs.userAgent.util");
goog.module.declareLegacyNamespace();
const {USE_CLIENT_HINTS} = goog.require("goog.labs.userAgent");
const {caseInsensitiveContains, contains} = goog.require("goog.string.internal");
const ASSUME_CLIENT_HINTS_SUPPORT = false;
function getNativeUserAgentString() {
  const navigator = getNavigator();
  if (navigator) {
    const userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
}
function getNativeUserAgentData() {
  if (!USE_CLIENT_HINTS) {
    return null;
  }
  const navigator = getNavigator();
  if (navigator) {
    return navigator.userAgentData || null;
  }
  return null;
}
function getNavigator() {
  return goog.global.navigator;
}
let userAgentInternal = getNativeUserAgentString();
let userAgentDataInternal = getNativeUserAgentData();
function setUserAgent(userAgent = undefined) {
  userAgentInternal = typeof userAgent === "string" ? userAgent : getNativeUserAgentString();
}
function getUserAgent() {
  return userAgentInternal;
}
function setUserAgentData(userAgentData) {
  userAgentDataInternal = userAgentData;
}
function resetUserAgentData() {
  userAgentDataInternal = getNativeUserAgentData();
}
function getUserAgentData() {
  return userAgentDataInternal;
}
function matchUserAgentDataBrand(str) {
  const data = getUserAgentData();
  if (!data) {
    return false;
  }
  return data.brands.some(({brand}) => brand && contains(brand, str));
}
function matchUserAgent(str) {
  const userAgent = getUserAgent();
  return contains(userAgent, str);
}
function matchUserAgentIgnoreCase(str) {
  const userAgent = getUserAgent();
  return caseInsensitiveContains(userAgent, str);
}
function extractVersionTuples(userAgent) {
  const versionRegExp = new RegExp("(\\w[\\w ]+)" + "/" + "([^\\s]+)" + "\\s*" + "(?:\\((.*?)\\))?", "g");
  const data = [];
  let match;
  while (match = versionRegExp.exec(userAgent)) {
    data.push([match[1], match[2], match[3] || undefined]);
  }
  return data;
}
exports = {ASSUME_CLIENT_HINTS_SUPPORT, extractVersionTuples, getNativeUserAgentString, getUserAgent, getUserAgentData, matchUserAgent, matchUserAgentDataBrand, matchUserAgentIgnoreCase, resetUserAgentData, setUserAgent, setUserAgentData, };

;return exports;});
