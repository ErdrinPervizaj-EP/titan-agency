import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Module-level stack of active traps, so a dialog opened on top of a Drawer
 * only lets the topmost overlay respond to Tab.
 */
const trapStack: symbol[] = [];

/**
 * Traps Tab/Shift+Tab focus inside `containerRef` while `active`, moves
 * focus into the container on activation, and restores it to whatever was
 * focused beforehand on deactivation.
 */
export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const idRef = useRef(Symbol('focus-trap'));
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const id = idRef.current;
    trapStack.push(id);
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    const focusables = () =>
      container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];

    if (!container?.contains(document.activeElement)) {
      const first = focusables()[0];
      (first ?? container)?.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (trapStack[trapStack.length - 1] !== id) return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      const goingBackward = e.shiftKey;
      const atEdge = goingBackward ? currentIndex <= 0 : currentIndex === items.length - 1;
      if (!atEdge) return;
      e.preventDefault();
      items[goingBackward ? items.length - 1 : 0].focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      trapStack.splice(trapStack.indexOf(id), 1);
      previouslyFocused.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
