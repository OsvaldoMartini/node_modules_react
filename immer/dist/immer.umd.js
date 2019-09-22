var e,r;e=this,r=function(e){"use strict";var r,t,n,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")},a=function(){function e(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(r,t,n){return t&&e(r.prototype,t),n&&e(r,n),r}}(),f="undefined"!=typeof Symbol?Symbol("immer-nothing"):(n=!0,(t="immer-nothing")in(r={})?Object.defineProperty(r,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):r[t]=n,r),u="undefined"!=typeof Symbol?Symbol("immer-state"):"__$immer_state";function s(e){return!!e&&!!e[u]}function c(e){if(!e)return!1;if("object"!==(void 0===e?"undefined":o(e)))return!1;if(Array.isArray(e))return!0;var r=Object.getPrototypeOf(e);return null===r||r===Object.prototype}var l=Object.assign||function(e,r){for(var t in r)h(r,t)&&(e[t]=r[t]);return e};function p(e){if(Array.isArray(e))return e.slice();var r=void 0===e.__proto__?Object.create(null):{};return l(r,e)}function d(e,r){if(Array.isArray(e))for(var t=0;t<e.length;t++)r(t,e[t],e);else for(var n in e)r(n,e[n],e)}function h(e,r){return Object.prototype.hasOwnProperty.call(e,r)}function y(e,r){return e===r?0!==e||1/e==1/r:e!=e&&r!=r}function v(e,r,t,n){Array.isArray(e.base)?function(e,r,t,n){for(var o=e.base,i=e.copy,a=e.assigned,f=Math.min(o.length,i.length),u=0;u<f;u++)if(a[u]&&o[u]!==i[u]){var s=r.concat(u);t.push({op:"replace",path:s,value:i[u]}),n.push({op:"replace",path:s,value:o[u]})}if(f<i.length){for(var c=f;c<i.length;c++)t.push({op:"add",path:r.concat(c),value:i[c]});n.push({op:"replace",path:r.concat("length"),value:o.length})}else if(f<o.length){t.push({op:"replace",path:r.concat("length"),value:i.length});for(var l=f;l<o.length;l++)n.push({op:"add",path:r.concat(l),value:o[l]})}}(e,r,t,n):function(e,r,t,n){var o=e.base,i=e.copy;d(e.assigned,function(e,a){var f=o[e],u=i[e],s=a?e in o?"replace":"add":"remove";if(f!==o||"replace"!==s){var c=r.concat(e);t.push("remove"===s?{op:s,path:c}:{op:s,path:c,value:u}),n.push("add"===s?{op:"remove",path:c}:"remove"===s?{op:"add",path:c,value:f}:{op:"replace",path:c,value:f})}})}(e,r,t,n)}var b={},g=[],m=function(){return g[g.length-1]};function w(e,r){var t=void 0;if(s(e)){var n=e[u];n.finalizing=!0,t=p(n.draft),n.finalizing=!1}else t=p(e);d(e,function(e){Object.defineProperty(t,""+e,function(e){return b[e]||(b[e]={configurable:!0,enumerable:!0,get:function(){return function(e,r){A(e);var t=O(e)[r];if(!e.finalizing&&t===e.base[r]&&c(t))return j(e),e.copy[r]=w(t,e);return t}(this[u],e)},set:function(r){!function(e,r,t){if(A(e),e.assigned[r]=!0,!e.modified){if(y(O(e)[r],t))return;P(e),j(e)}e.copy[r]=t}(this[u],e,r)}})}(""+e))});var o,i,a,f={scope:r?r.scope:m(),modified:!1,finalizing:!1,finalized:!1,assigned:{},parent:r,base:e,draft:t,copy:null,revoke:z,revoked:!1};return o=t,i=u,a=f,Object.defineProperty(o,i,{value:a,enumerable:!1,writable:!0}),f.scope.push(f),t}function z(){this.revoked=!0}function O(e){return e.copy||e.base}function P(e){e.modified||(e.modified=!0,e.parent&&P(e.parent))}function j(e){e.copy||(e.copy=p(e.base))}function A(e){if(!0===e.revoked)throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+JSON.stringify(e.copy||e.base))}function k(e){for(var r=e.base,t=e.draft,n=Object.keys(t),o=n.length-1;o>=0;o--)if(void 0===r[n[o]]&&!h(r,n[o]))return!0;return n.length!==Object.keys(r).length}function E(e){var r=e.draft;if(r.length!==e.base.length)return!0;var t=Object.getOwnPropertyDescriptor(r,r.length-1);return!(!t||t.get)}var x=Object.freeze({scopes:g,currentScope:m,willFinalize:function(e,r,t){var n=m();n.forEach(function(e){return e.finalizing=!0}),void 0!==e&&e!==r||(t&&function e(r){if(r&&"object"===(void 0===r?"undefined":o(r))){var t=r[u];if(t){var n=t.base,i=t.draft,a=t.assigned;if(Array.isArray(r)){if(E(t)){if(P(t),a.length=!0,i.length<n.length)for(var f=i.length;f<n.length;f++)a[f]=!1;else for(var s=n.length;s<i.length;s++)a[s]=!0;for(var c=0;c<i.length;c++)void 0===a[c]&&e(i[c])}}else Object.keys(i).forEach(function(r){void 0!==n[r]||h(n,r)?a[r]||e(i[r]):(a[r]=!0,P(t))}),Object.keys(n).forEach(function(e){void 0!==i[e]||h(i,e)||(a[e]=!1,P(t))})}}}(r),function(e){for(var r=e.length-1;r>=0;r--){var t=e[r];!1===t.modified&&(Array.isArray(t.base)?E(t)&&P(t):k(t)&&P(t))}}(n))},createDraft:w}),S=[],D=function(){return S[S.length-1]};function F(e,r){var t={scope:r?r.scope:D(),modified:!1,finalized:!1,assigned:{},parent:r,base:e,draft:null,drafts:{},copy:null,revoke:null},n=Array.isArray(e)?Proxy.revocable([t],I):Proxy.revocable(t,_),o=n.revoke,i=n.proxy;return t.draft=i,t.revoke=o,t.scope.push(t),i}var _={get:function(e,r){if(r===u)return e;var t=e.drafts;if(!e.modified&&h(t,r))return t[r];var n=N(e)[r];if(e.finalized||!c(n))return n;if(e.modified){if(n!==e.base[r])return n;t=e.copy}return t[r]=F(n,e)},has:function(e,r){return r in N(e)},ownKeys:function(e){return Reflect.ownKeys(N(e))},set:function(e,r,t){if(!e.modified){var n=t?y(e.base[r],t)||t===e.drafts[r]:y(e.base[r],t)&&r in e.base;if(n)return!0;C(e)}return e.assigned[r]=!0,e.copy[r]=t,!0},deleteProperty:function(e,r){(void 0!==e.base[r]||r in e.base)&&(e.assigned[r]=!1,C(e));e.copy&&delete e.copy[r];return!0},getOwnPropertyDescriptor:function(e,r){var t=e.modified?e.copy:h(e.drafts,r)?e.drafts:e.base,n=Reflect.getOwnPropertyDescriptor(t,r);!n||Array.isArray(t)&&"length"===r||(n.configurable=!0);return n},defineProperty:function(){throw new Error("Immer does not support defining properties on draft objects.")},setPrototypeOf:function(){throw new Error("Immer does not support `setPrototypeOf()`.")}},I={};function N(e){return e.copy||e.base}function C(e){e.modified||(e.modified=!0,e.copy=l(p(e.base),e.drafts),e.drafts=null,e.parent&&C(e.parent))}d(_,function(e,r){I[e]=function(){return arguments[0]=arguments[0][0],r.apply(this,arguments)}}),I.deleteProperty=function(e,r){if(isNaN(parseInt(r)))throw new Error("Immer does not support deleting properties from arrays: "+r);return _.deleteProperty.call(this,e[0],r)},I.set=function(e,r,t){if("length"!==r&&isNaN(parseInt(r)))throw new Error("Immer does not support setting non-numeric properties on arrays: "+r);return _.set.call(this,e[0],r,t)};var U=Object.freeze({scopes:S,currentScope:D,willFinalize:function(){},createDraft:F});var T={useProxies:"undefined"!=typeof Proxy&&"undefined"!=typeof Reflect,autoFreeze:"undefined"!=typeof process?"production"!==process.env.NODE_ENV:"verifyMinified"===function(){}.name,onAssign:null,onDelete:null,onCopy:null},M=function(){function e(r){i(this,e),l(this,T,r),this.setUseProxies(this.useProxies),this.produce=this.produce.bind(this)}return a(e,[{key:"produce",value:function(e,r,t){var n=this;if("function"==typeof e&&"function"!=typeof r){var o=r;return r=e,function(){for(var e=arguments.length,t=Array(e>1?e-1:0),i=1;i<e;i++)t[i-1]=arguments[i];var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o;return n.produce(a,function(e){var n;return(n=r).call.apply(n,[e,e].concat(t))})}}if("function"!=typeof r)throw new Error("if first argument is not a function, the second argument to produce should be a function");if(void 0!==t&&"function"!=typeof t)throw new Error("the third argument of a producer should not be set or a function");var i=void 0;if(c(e))if(s(e)){if(void 0===(i=r.call(e,e)))return e}else{this.scopes.push([]);var a=this.createDraft(e);try{i=r.call(a,a),this.willFinalize(i,a,!!t);var l=t&&[],p=t&&[];if(void 0===i||i===a)i=this.finalize(a,[],l,p);else{if(a[u].modified)throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.");c(i)&&(i=this.finalize(i)),t&&(l.push({op:"replace",path:[],value:i}),p.push({op:"replace",path:[],value:e}))}}finally{this.currentScope().forEach(function(e){return e.revoke()}),this.scopes.pop()}t&&t(l,p)}else if(void 0===(i=r(e)))return e;return i===f?void 0:i}},{key:"setAutoFreeze",value:function(e){this.autoFreeze=e}},{key:"setUseProxies",value:function(e){this.useProxies=e,l(this,e?U:x)}},{key:"finalize",value:function(e,r,t,n){var o=e[u];if(!o)return Object.isFrozen(e)?e:this.finalizeTree(e);if(o.scope!==this.currentScope())return e;if(!o.modified)return o.base;if(!o.finalized){if(o.finalized=!0,this.finalizeTree(o.draft,r,t,n),this.onDelete){var i=o.assigned;for(var a in i)i[a]||this.onDelete(o,a)}this.onCopy&&this.onCopy(o),this.autoFreeze&&1===this.scopes.length&&Object.freeze(o.copy),t&&v(o,r,t,n)}return o.copy}},{key:"finalizeTree",value:function(e,r,t,n){var o=this,i=e[u];i&&(e=this.useProxies?i.copy:i.copy=p(i.draft));var a=this.onAssign;return d(e,function f(u,l,p){var h=!!i&&p===e;if(s(l)){if(p[u]=l=t&&h&&!i.assigned[u]?o.finalize(l,r.concat(u),t,n):o.finalize(l),h&&l===i.base[u])return}else{if(h&&y(l,i.base[u]))return;c(l)&&!Object.isFrozen(l)&&d(l,f)}h&&a&&a(i,u,l)}),e}}]),e}(),R=new M,K=R.produce,J=K(function(e,r){for(var t=0;t<r.length;t++){var n=r[t],i=n.path;if(0===i.length&&"replace"===n.op)e=n.value;else{for(var a=e,f=0;f<i.length-1;f++)if(!(a=a[i[f]])||"object"!==(void 0===a?"undefined":o(a)))throw new Error("Cannot apply patch, path doesn't resolve: "+i.join("/"));var u=i[i.length-1];switch(n.op){case"replace":case"add":a[u]=n.value;break;case"remove":if(Array.isArray(a)){if(u!==a.length-1)throw new Error("Only the last index of an array can be removed, index: "+u+", length: "+a.length);a.length-=1}else delete a[u];break;default:throw new Error("Unsupported patch operation: "+n.op)}}}return e});e.produce=K,e.default=K,e.setAutoFreeze=function(e){return R.setAutoFreeze(e)},e.setUseProxies=function(e){return R.setUseProxies(e)},e.applyPatches=J,e.Immer=M,e.original=function(e){if(e&&e[u])return e[u].base},e.isDraft=s,e.nothing=f,Object.defineProperty(e,"__esModule",{value:!0})},"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(e.immer={});
//# sourceMappingURL=immer.umd.js.map
