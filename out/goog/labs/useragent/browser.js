/*TRANSPILED*/goog.loadModule(function(exports) {'use strict';/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
goog.module("goog.labs.userAgent.browser");
goog.module.declareLegacyNamespace();
const googArray = goog.require("goog.array");
const googObject = goog.require("goog.object");
const util = goog.require("goog.labs.userAgent.util");
const {compareVersions} = goog.require("goog.string.internal");
function useUserAgentBrand() {
  const userAgentData = util.getUserAgentData();
  return !!userAgentData && userAgentData.brands.length > 0;
}
function matchOpera() {
  if (util.ASSUME_CLIENT_HINTS_SUPPORT || util.getUserAgentData()) {
    return false;
  }
  return util.matchUserAgent("Opera");
}
function matchIE() {
  if (util.ASSUME_CLIENT_HINTS_SUPPORT || util.getUserAgentData()) {
    return false;
  }
  return util.matchUserAgent("Trident") || util.matchUserAgent("MSIE");
}
function matchEdgeHtml() {
  if (util.ASSUME_CLIENT_HINTS_SUPPORT || util.getUserAgentData()) {
    return false;
  }
  return util.matchUserAgent("Edge");
}
function matchEdgeChromium() {
  if (useUserAgentBrand()) {
    return util.matchUserAgentDataBrand("Edge");
  }
  return util.matchUserAgent("Edg/");
}
function matchOperaChromium() {
  if (useUserAgentBrand()) {
    return util.matchUserAgentDataBrand("Opera");
  }
  return util.matchUserAgent("OPR");
}
function matchFirefox() {
  if (useUserAgentBrand()) {
    return util.matchUserAgentDataBrand("Firefox");
  }
  return util.matchUserAgent("Firefox") || util.matchUserAgent("FxiOS");
}
function matchSafari() {
  if (useUserAgentBrand()) {
    return util.matchUserAgentDataBrand("Safari");
  }
  return util.matchUserAgent("Safari") && !(matchChrome() || matchCoast() || matchOpera() || matchEdgeHtml() || matchEdgeChromium() || matchOperaChromium() || matchFirefox() || isSilk() || util.matchUserAgent("Android"));
}
function matchCoast() {
  if (util.ASSUME_CLIENT_HINTS_SUPPORT || util.getUserAgentData()) {
    return false;
  }
  return util.matchUserAgent("Coast");
}
function matchIosWebview() {
  return (util.matchUserAgent("iPad") || util.matchUserAgent("iPhone")) && !matchSafari() && !matchChrome() && !matchCoast() && !matchFirefox() && util.matchUserAgent("AppleWebKit");
}
function matchChrome() {
  if (useUserAgentBrand()) {
    return util.matchUserAgentDataBrand("Chromium");
  }
  return (util.matchUserAgent("Chrome") || util.matchUserAgent("CriOS")) && !matchEdgeHtml();
}
function matchAndroidBrowser() {
  return util.matchUserAgent("Android") && !(isChrome() || isFirefox() || isOpera() || isSilk());
}
const isOpera = matchOpera;
const isIE = matchIE;
const isEdge = matchEdgeHtml;
const isEdgeChromium = matchEdgeChromium;
const isOperaChromium = matchOperaChromium;
const isFirefox = matchFirefox;
const isSafari = matchSafari;
const isCoast = matchCoast;
const isIosWebview = matchIosWebview;
const isChrome = matchChrome;
const isAndroidBrowser = matchAndroidBrowser;
function isSilk() {
  if (useUserAgentBrand()) {
    return util.matchUserAgentDataBrand("Silk");
  }
  return util.matchUserAgent("Silk");
}
function getVersion() {
  const userAgentString = util.getUserAgent();
  if (isIE()) {
    return getIEVersion(userAgentString);
  }
  const versionTuples = util.extractVersionTuples(userAgentString);
  const versionMap = {};
  versionTuples.forEach(tuple => {
    const key = tuple[0];
    const value = tuple[1];
    versionMap[key] = value;
  });
  const versionMapHasKey = goog.partial(googObject.containsKey, versionMap);
  function lookUpValueWithKeys(keys) {
    const key = googArray.find(keys, versionMapHasKey);
    return versionMap[key] || "";
  }
  if (isOpera()) {
    return lookUpValueWithKeys(["Version", "Opera"]);
  }
  if (isEdge()) {
    return lookUpValueWithKeys(["Edge"]);
  }
  if (isEdgeChromium()) {
    return lookUpValueWithKeys(["Edg"]);
  }
  if (isChrome()) {
    return lookUpValueWithKeys(["Chrome", "CriOS", "HeadlessChrome"]);
  }
  const tuple = versionTuples[2];
  return tuple && tuple[1] || "";
}
function isVersionOrHigher(version) {
  return compareVersions(getVersion(), version) >= 0;
}
function getIEVersion(userAgent) {
  const rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  let version = "";
  const msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    const tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if (msie[1] == "7.0") {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
            break;
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
}
exports = {getVersion, isAndroidBrowser, isChrome, isCoast, isEdge, isEdgeChromium, isFirefox, isIE, isIosWebview, isOpera, isOperaChromium, isSafari, isSilk, isVersionOrHigher, };

;return exports;});
