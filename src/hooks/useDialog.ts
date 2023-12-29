import { useState } from 'react';

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => {
    setIsOpen(false);
  };
  const open = () => {
    setIsOpen(true);
  };
  return {
    isOpen,
    close,
    open,
  };
}
