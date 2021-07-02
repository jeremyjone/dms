"use strict";
exports.__esModule = true;
exports.protocolCheck = void 0;
function _registerEvent(target, eventType, cb) {
  if (target.addEventListener) {
    target.addEventListener(eventType, cb);
    return {
      remove: function() {
        target.removeEventListener(eventType, cb);
      }
    };
  } else {
    target.attachEvent(eventType, cb);
    return {
      remove: function() {
        target.detachEvent(eventType, cb);
      }
    };
  }
}
function _createHiddenIframe(target, uri) {
  const iframe = document.createElement("iframe");
  iframe.src = uri;
  iframe.id = "hiddenIframe";
  iframe.style.display = "none";
  target.appendChild(iframe);
  return iframe;
}
function openUriWithHiddenFrame(uri, failCb, successCb) {
  const timeout = setTimeout(function() {
    failCb();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handler.remove();
  }, 1000);
  let iframe = document.querySelector("#hiddenIframe");
  if (!iframe) {
    iframe = _createHiddenIframe(document.body, "about:blank");
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const handler = _registerEvent(window, "blur", onBlur);
  function onBlur() {
    clearTimeout(timeout);
    handler.remove();
    successCb();
  }
  iframe.contentWindow.location.href = uri;
}
function openUriWithTimeoutHack(uri, failCb, successCb) {
  const timeout = setTimeout(function() {
    failCb();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handler.remove();
  }, 1000);
  //handle page running in an iframe (blur must be registered with top level window)
  let target = window;
  while (target != target.parent) {
    target = target.parent;
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const handler = _registerEvent(target, "blur", onBlur);
  function onBlur() {
    clearTimeout(timeout);
    handler.remove();
    successCb();
  }
  window.location = uri;
}
function openUriUsingFirefox(uri, failCb, successCb) {
  let iframe = document.querySelector("#hiddenIframe");
  if (!iframe) {
    iframe = _createHiddenIframe(document.body, "about:blank");
  }
  try {
    iframe.contentWindow.location.href = uri;
    successCb();
  } catch (e) {
    if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
      failCb();
    }
  }
}
function openUriUsingIE10InWindows7(uri, failCb, successCb) {
  const timeout = setTimeout(failCb, 1000);
  window.addEventListener("blur", function() {
    clearTimeout(timeout);
    successCb();
  });
  let iframe = document.querySelector("#hiddenIframe");
  if (!iframe) {
    iframe = _createHiddenIframe(document.body, "about:blank");
  }
  try {
    iframe.contentWindow.location.href = uri;
  } catch (e) {
    failCb();
    clearTimeout(timeout);
  }
}
function openUriInNewWindowHack(uri, failCb, successCb) {
  const myWindow = window.open("", "", "width=0,height=0");
  myWindow.document.write("<iframe src='" + uri + "'></iframe>");
  setTimeout(function() {
    try {
      myWindow.location.href;
      myWindow.setTimeout("window.close()", 1000);
      successCb();
    } catch (e) {
      myWindow.close();
      failCb();
    }
  }, 1000);
}
function openUriWithMsLaunchUri(uri, failCb, successCb) {
  navigator.msLaunchUri(uri, successCb, failCb);
}
function checkBrowser() {
  const isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
  const ua = navigator.userAgent.toLowerCase();
  return {
    isOpera: isOpera,
    isFirefox: typeof InstallTrigger !== "undefined",
    isSafari:
      (~ua.indexOf("safari") && !~ua.indexOf("chrome")) ||
      Object.prototype.toString
        .call(window.HTMLElement)
        .indexOf("Constructor") > 0,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    isChrome: !!window.chrome && !isOpera,
    isIE: /*@cc_on!@*/ false || !!document.documentMode // At least IE6
  };
}
function getInternetExplorerVersion() {
  let rv = -1;
  if (navigator.appName === "Microsoft Internet Explorer") {
    const ua = navigator.userAgent;
    const re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
    if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
  } else if (navigator.appName === "Netscape") {
    const ua = navigator.userAgent;
    const re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
    if (re.exec(ua) != null) {
      rv = parseFloat(RegExp.$1);
    }
  }
  return rv;
}
function openUriUsingIEInOlderWindows(uri, failCb, successCb) {
  if (getInternetExplorerVersion() === 10) {
    openUriUsingIE10InWindows7(uri, failCb, successCb);
  } else if (
    getInternetExplorerVersion() === 9 ||
    getInternetExplorerVersion() === 11
  ) {
    openUriWithHiddenFrame(uri, failCb, successCb);
  } else {
    openUriInNewWindowHack(uri, failCb, successCb);
  }
}
function protocolCheck(uri, failCb, successCb, unsupportedCb) {
  function failCallback() {
    failCb && failCb();
  }
  function successCallback() {
    successCb && successCb();
  }
  if (navigator.msLaunchUri) {
    //for IE and Edge in Win 8 and Win 10
    openUriWithMsLaunchUri(uri, failCb, successCb);
  } else {
    const browser = checkBrowser();
    if (browser.isFirefox) {
      openUriUsingFirefox(uri, failCallback, successCallback);
    } else if (browser.isChrome || browser.isIOS) {
      openUriWithTimeoutHack(uri, failCallback, successCallback);
    } else if (browser.isIE) {
      openUriUsingIEInOlderWindows(uri, failCallback, successCallback);
    } else if (browser.isSafari) {
      openUriWithHiddenFrame(uri, failCallback, successCallback);
    } else {
      unsupportedCb();
      //not supported, implement please
    }
  }
}
exports.protocolCheck = protocolCheck;
