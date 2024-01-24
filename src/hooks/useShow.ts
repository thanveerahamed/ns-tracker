import { useState } from 'react';

export function useShow() {
  const [visible, setVisible] = useState(false);
  const hide = () => {
    setVisible(false);
  };
  const show = () => {
    setVisible(true);
  };

  const toggle = () => {
    setVisible((prevState) => !prevState);
  };

  return {
    visible,
    hide,
    show,
    toggle,
  };
}
