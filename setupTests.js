import '@testing-library/jest-dom';

// Polyfill for TextEncoder used by Firebase Auth in Node
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Polyfill for ReadableStream used by Firebase Auth in Node
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = require('stream').Readable;
} 