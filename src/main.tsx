import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite/WebSocket sandbox HMR connection warnings in the preview frame
if (typeof window !== 'undefined') {
  // Global proxy to trap WebSocket errors at construction and prevent bubbling/printing
  if (window.WebSocket) {
    const OriginalWebSocket = window.WebSocket;
    const SilentWebSocket = new Proxy(OriginalWebSocket, {
      construct(target, args) {
        const ws = Reflect.construct(target, args as [string, (string | string[])?]);
        
        // Suppress and absorb error/close events silently so they don't propagate to window
        ws.addEventListener('error', (event) => {
          event.stopPropagation();
          event.stopImmediatePropagation();
        }, { capture: true });
        
        ws.addEventListener('close', (event) => {
          event.stopPropagation();
          event.stopImmediatePropagation();
        }, { capture: true });

        return ws;
      }
    });
    try {
      // Attempt to override using defineProperty first, which handles getter-only descriptors better if configurable
      Object.defineProperty(window, 'WebSocket', {
        value: SilentWebSocket,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      try {
        // Fallback to direct assignment
        (window as any).WebSocket = SilentWebSocket;
      } catch (err) {
        console.warn('Could not override window.WebSocket in this sandbox environment:', err);
      }
    }
  }

  const isWebSocketErrorObject = (obj: any): boolean => {
    if (!obj) return false;

    // Ensure we do not trap standard JavaScript runtime exceptions that don't relate to WebSockets.
    if (obj instanceof Error) {
      const name = obj.name;
      if (name === 'SyntaxError' || name === 'ReferenceError' || name === 'TypeError' || name === 'RangeError' || name === 'URIError') {
        return false;
      }
      const errMsg = String(obj.message || '').toLowerCase();
      const isWsMsg = 
        errMsg.includes('websocket') ||
        errMsg.includes('hmr') ||
        errMsg.includes('hot-reload') ||
        errMsg.includes('vite:connection');
      if (!isWsMsg) return false;
    }

    // 1. Direct object constructor checks for WebSockets
    const cName = obj?.constructor?.name || '';
    if (cName === 'WebSocket' || cName === 'WebSocketEvent') return true;

    // 2. DOM Event / CloseEvent checks
    if (obj instanceof Event || (typeof obj === 'object' && ('type' in obj || 'target' in obj))) {
      const target = obj.target as any;
      const targetCName = target?.constructor?.name || '';
      
      // If it is a direct WebSocket event or targets a WebSocket object
      if (targetCName === 'WebSocket' || (target && typeof target === 'object' && 'readyState' in target && 'url' in target)) {
        const url = String(target.url || '').toLowerCase();
        if (url.startsWith('ws://') || url.startsWith('wss://')) {
          // Check for specific close codes (e.g., 1006 abnormal closure, 1001 going away, 1005 no status, 1015 TLS handshake)
          if ('code' in obj) {
            const closeCode = (obj as any).code;
            if (typeof closeCode === 'number' && (closeCode === 1006 || closeCode === 1001 || closeCode === 1005 || closeCode === 1015)) {
              return true;
            }
          }
          // Also match close or error event types
          if (obj.type === 'close' || obj.type === 'error') {
            return true;
          }
        }
      }
      
      // If the event itself is a CloseEvent or has CloseEvent-like code properties
      if (obj.constructor?.name === 'CloseEvent' || ('code' in obj && 'wasClean' in obj)) {
        const closeCode = (obj as any).code;
        if (typeof closeCode === 'number' && (closeCode === 1006 || closeCode === 1001 || closeCode === 1005 || closeCode === 1015)) {
          return true;
        }
      }
    }

    // 3. Precise error messages and connection codes for HMR/Hot-reload failures
    const message = String(obj.message || obj.reason || obj.description || obj || '').toLowerCase();
    const isWsSpecificMessage = 
      message.includes('websocket closed without opened') ||
      message.includes('failed to connect to websocket') ||
      message.includes('websocket connection failed') ||
      message.includes('hmr connection failed') ||
      message.includes('hot-reload connection') ||
      message.includes('vite:connection') ||
      (message.includes('websocket connection to') && message.includes('failed'));

    if (isWsSpecificMessage) {
      return true;
    }

    const code = obj.code;
    if (typeof code === 'string' && (code === 'ECONNREFUSED' || code === 'EPIPE' || code === 'ECONNRESET')) {
      const url = String(obj.url || obj.target?.url || '').toLowerCase();
      if (url.startsWith('ws://') || url.startsWith('wss://')) {
        return true;
      }
    }

    // Check deep nested error
    if (obj.error && typeof obj.error === 'object') {
      return isWebSocketErrorObject(obj.error);
    }

    return false;
  };

  const shouldIgnore = (args: any[]) => {
    return args.some(arg => {
      if (isWebSocketErrorObject(arg)) return true;
      
      if (typeof arg === 'string') {
        const str = arg.toLowerCase();
        // Be highly restrictive: ONLY ignore specific WebSocket / HMR messages
        return (
          str.includes('websocket closed without opened') ||
          str.includes('failed to connect to websocket') ||
          str.includes('websocket connection failed') ||
          str.includes('[vite] failed to connect to websocket') ||
          (str.includes('websocket connection to') && str.includes('failed'))
        );
      }
      return false;
    });
  };

  const originalError = console.error;
  console.error = function (...args) {
    if (shouldIgnore(args)) return;
    originalError.apply(console, args);
  };

  const originalWarn = console.warn;
  console.warn = function (...args) {
    if (shouldIgnore(args)) return;
    originalWarn.apply(console, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (isWebSocketErrorObject(reason)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    if (reason && typeof reason === 'object') {
      const msg = reason.message || '';
      const stack = reason.stack || '';
      const fullText = (msg + ' ' + stack).toLowerCase();
      if (
        fullText.includes('websocket closed without opened') ||
        fullText.includes('failed to connect to websocket') ||
        (fullText.includes('websocket connection to') && fullText.includes('failed'))
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });

  window.addEventListener('error', (event) => {
    if (isWebSocketErrorObject(event) || isWebSocketErrorObject(event.error)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    const msg = event.message || '';
    const errorMsg = event.error?.message || '';
    const fullText = (msg + ' ' + errorMsg).toLowerCase();
    if (
      fullText.includes('websocket closed without opened') ||
      fullText.includes('failed to connect to websocket') ||
      (fullText.includes('websocket connection to') && fullText.includes('failed'))
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

