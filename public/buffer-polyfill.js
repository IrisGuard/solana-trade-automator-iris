
// This file helps ensure Buffer is available globally
(function() {
  if (typeof window !== 'undefined' && !window.Buffer) {
    console.log('Buffer polyfill setup from script tag');
    window.Buffer = window.Buffer || {};
  }
})();
