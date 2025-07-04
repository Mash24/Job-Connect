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

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    img: ({ ...props }) => <img {...props} />,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
    path: ({ ...props }) => <path {...props} />,
    circle: ({ ...props }) => <circle {...props} />,
    rect: ({ ...props }) => <rect {...props} />,
    g: ({ children, ...props }) => <g {...props}>{children}</g>,
    animatePresence: ({ children }) => children,
  },
  AnimatePresence: ({ children }) => children,
})); 