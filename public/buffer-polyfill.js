
// This file helps ensure Buffer is available globally
(function() {
  if (typeof window !== 'undefined') {
    try {
      const buffer = require('buffer/');
      if (!window.Buffer) {
        window.Buffer = buffer.Buffer;
        console.log('Buffer polyfill setup from script tag');
      }
    } catch (e) {
      console.warn('Failed to load buffer polyfill from script tag:', e);
    }
  }
})();
