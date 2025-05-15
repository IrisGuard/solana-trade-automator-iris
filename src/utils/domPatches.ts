/**
 * DOM Patches and Polyfills
 *
 * This file contains patches and polyfills for the DOM that are necessary
 * for the application to function correctly.
 */

/**
 * Polyfill for Element.prototype.remove
 *
 * This is necessary for older browsers that do not support the remove method.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
 */
export function applyElementRemovePolyfill() {
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }
}

/**
 * Polyfill for Array.prototype.includes
 *
 * This is necessary for older browsers that do not support the includes method.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 */
export function applyArrayIncludesPolyfill() {
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.includes called on null or undefined');
      }

      var O = Object(this);
      var len = parseInt(O.length, 10) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1], 10) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
           (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
          return true;
        }
        k++;
      }
      return false;
    };
  }
}

/**
 * Polyfill for String.prototype.startsWith
 *
 * This is necessary for older browsers that do not support the startsWith method.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
 */
export function applyStringStartsWithPolyfill() {
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
      return this.substring(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
  }
}

/**
 * Polyfill for String.prototype.endsWith
 *
 * This is necessary for older browsers that do not support the endsWith method.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
 */
export function applyStringEndsWithPolyfill() {
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
      if (this_len === undefined || this_len > this.length) {
        this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
    };
  }
}

/**
 * Polyfill for Object.assign
 *
 * This is necessary for older browsers that do not support the Object.assign method.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
export function applyObjectAssignPolyfill() {
  if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }
}

/**
 * Polyfill for CustomEvent
 *
 * This is necessary for older browsers that do not support the CustomEvent constructor.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
export function applyCustomEventPolyfill() {
  if (typeof window.CustomEvent !== "function") {
    function CustomEvent ( event: any, params: any ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    (window as any).CustomEvent = CustomEvent;
  }
}

/**
 * Apply all standard DOM polyfills
 */
export function applyStandardDOMPolyfills() {
  applyElementRemovePolyfill();
  applyArrayIncludesPolyfill();
  applyStringStartsWithPolyfill();
  applyStringEndsWithPolyfill();
  applyObjectAssignPolyfill();
  applyCustomEventPolyfill();
}

/**
 * Polyfill for React JSX runtime
 */
export function applyReactJsxPatches() {
  try {
    // Check if window.React exists
    if (typeof window !== 'undefined' && window.React) {
      // Safely attach JSX functions if they don't exist
      if (!window.React.jsx) {
        const reactModule = window.React;
        Object.defineProperty(reactModule, 'jsx', {
          value: reactModule.createElement,
          writable: false,
          configurable: true
        });
      }
      
      if (!window.React.jsxs) {
        const reactModule = window.React;
        Object.defineProperty(reactModule, 'jsxs', {
          value: reactModule.createElement,
          writable: false,
          configurable: true
        });
      }
      
      console.log('React JSX runtime patched successfully');
    }
  } catch (error) {
    console.error('Error applying React JSX patches:', error);
  }
}

// Apply all DOM patches in one call
export function applyAllDOMPatches() {
  try {
    // Apply individual patches here
    applyStandardDOMPolyfills();
    applyReactJsxPatches();
    
    // Add other patch functions as needed
    
    console.log('All DOM patches applied successfully');
  } catch (error) {
    console.error('Error applying DOM patches:', error);
  }
}
