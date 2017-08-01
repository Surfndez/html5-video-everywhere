/* global OPTIONS:true, onPrefChange:true, LANGS:true */
/* global createNode:true, asyncGet:true, onReady:true, logify:true */
/* global preLoad:true, autoPlay:true, HANDLE_VOL_PREF_CHANGE:true */
/* global rmChildren:true, Qlt:true, Cdc:true, chgPref:true, isLoop:true */
/* global setClipboard:true */
// the following jshint global rule is only because jshint support for ES6 arrow
// functions is limited
/* global wrapper:true, args:true, auto:true, lp:true */
"use strict";

// This Addons Preferences
let OPTIONS, init;
// push your prefernces change listner function to this table, yah the old way
const onPrefChange = [];
const Cdc = ["webm", "mp4"];
const Qlt = ["higher", "high", "medium", "low"];
const LANGS = [
  "af", "ar", "bn", "de", "en", "es", "fi", "fr", "hi", "id", "is", "it", "ja", "ko", "pt", "ru",
  "tu", "zh"
];
// set it to false if the module uses custom listener
const HANDLE_VOL_PREF_CHANGE = true;
// self.port.on("preferences", function(prefs) {
//     OPTIONS = prefs;
//     if (init)
//         init();
//     onPrefChange.forEach(f => f());
// });
//
// self.port.on("prefChanged", function(pref) {
//     OPTIONS[pref.name] = pref.value;
//     if (pref.name === "volume" && HANDLE_VOL_PREF_CHANGE === true)
//         Array.forEach(document.getElementsByTagName("video"), el => {
//             el.volume = OPTIONS.volume / 100;
//         });
//     onPrefChange.forEach(f => f(pref.name));
// });
const chgPref = (name, val) => {
  self.port.emit("prefChang", {
    name: name,
    val: val
  });
};
const setClipboard = (text) => self.port.emit("setClipboard", text);
const createNode = (type, prprt, style, data) => {
  // logify("createNode", type, prprt);
  let node = document.createElement(type);
  if (prprt) Object.keys(prprt).forEach(p => node[p] = prprt[p]);
  if (style) Object.keys(style).forEach(s => node.style[s] = style[s]);
  if (data) Object.keys(data).forEach(d => node.dataset[d] = data[d]);
  return node;
};

const asyncGet = (url, headers = {}, mimetype = null) => {
  logify("asyncGet", url);
  return fetch(url, {
    headers: headers,
  }).then((res) => {
    if (res.ok) return res.text();
    else return Promise.reject();
  });
};

const logify = (...args) => {
  args = args.map(s => JSON.stringify(s, null, 2));
  args.unshift("[H5VEW]");
  dump(args.join(" ") + "\n");
};

const onReady = f => {
  if (document.readyState !== "loading") {
    if (OPTIONS)
      f();
    else
      init = f;
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      if (OPTIONS)
        f();
      else
        init = f;
    });
  }
};
const autoPlay = (auto = false) =>
  ((OPTIONS.autoplay === "1" || auto === true) && OPTIONS.autoplay !== "0");
const preLoad = (auto = false) =>
  ((OPTIONS.preload === "1" || auto === true) && OPTIONS.preload !== "0") ? "auto" : "metadata";
const isLoop = (lp = false) => ((OPTIONS.loop === "1" || lp) && OPTIONS.loop !== "0");

const rmChildren = (prnt) => {
  while (prnt && prnt.firstChild)
    prnt.removeChild(prnt.firstChild);
};
