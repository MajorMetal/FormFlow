/**
 * FormFlow Embed SDK
 *
 * Usage:
 *   <div data-formflow="FORM_ID"></div>
 *   <script src="https://your-cdn.com/formflow-embed.js"></script>
 *
 * Or programmatically:
 *   FormFlow.create({ target: '#my-form', config: {...} })
 *   FormFlow.popup({ config: {...} })
 */

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FormFlow } from './components/FormFlow';
import { FormConfig } from './types/form';

interface EmbedOptions {
  target: string | HTMLElement;
  config: FormConfig;
  onSubmit?: (answers: Record<string, string | string[] | number>) => void;
}

interface PopupOptions {
  config: FormConfig;
  onSubmit?: (answers: Record<string, string | string[] | number>) => void;
  onClose?: () => void;
}

const roots = new Map<HTMLElement, Root>();

function create(options: EmbedOptions): { destroy: () => void } {
  const container =
    typeof options.target === 'string'
      ? document.querySelector<HTMLElement>(options.target)
      : options.target;

  if (!container) {
    console.error(`[FormFlow] Target element not found: ${options.target}`);
    return { destroy: () => {} };
  }

  // Set minimum height if not set
  if (!container.style.height && !container.style.minHeight) {
    container.style.minHeight = '100vh';
  }

  const root = createRoot(container);
  roots.set(container, root);

  root.render(
    React.createElement(FormFlow, {
      config: options.config,
      onSubmit: options.onSubmit,
    })
  );

  return {
    destroy: () => {
      root.unmount();
      roots.delete(container);
    },
  };
}

function popup(options: PopupOptions): { close: () => void } {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 10001;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ff-fade-in 0.3s ease;
  `;

  // Create modal container
  const modal = document.createElement('div');
  modal.style.cssText = `
    width: 90vw;
    height: 90vh;
    max-width: 800px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    animation: ff-scale-in 0.3s ease;
  `;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position: absolute;
    top: 12px;
    right: 16px;
    z-index: 10;
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #666;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
  `;
  closeBtn.onmouseenter = () => { closeBtn.style.background = 'rgba(0,0,0,0.08)'; };
  closeBtn.onmouseleave = () => { closeBtn.style.background = 'none'; };

  const close = () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
      const root = roots.get(modal);
      if (root) {
        root.unmount();
        roots.delete(modal);
      }
      overlay.remove();
      options.onClose?.();
    }, 200);
  };

  closeBtn.onclick = close;
  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };

  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ff-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ff-scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;
  document.head.appendChild(style);

  // Mount form
  const root = createRoot(modal);
  roots.set(modal, root);

  root.render(
    React.createElement(FormFlow, {
      config: options.config,
      onSubmit: options.onSubmit,
      style: { minHeight: '100%' },
    })
  );

  return { close };
}

// Auto-init: scan for data-formflow attributes
function autoInit() {
  const elements = document.querySelectorAll<HTMLElement>('[data-formflow]');
  elements.forEach(el => {
    const configUrl = el.getAttribute('data-formflow');
    if (configUrl && configUrl !== 'true') {
      // If it's a URL, fetch the config
      fetch(configUrl)
        .then(res => res.json())
        .then((config: FormConfig) => {
          create({ target: el, config });
        })
        .catch(err => {
          console.error('[FormFlow] Failed to load form config:', err);
        });
    }
  });
}

// Run auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}

// Export global API
const FormFlowSDK = { create, popup, autoInit };

// Attach to window for script tag usage
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).FormFlow = FormFlowSDK;
}

export { create, popup, autoInit };
export default FormFlowSDK;
