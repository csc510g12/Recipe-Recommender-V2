const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
      removeItem: (key) => {
        delete store[key];
      },
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });