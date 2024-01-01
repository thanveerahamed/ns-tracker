import { useState } from 'react';

export function useSubmitted() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submit = () => {
    setIsSubmitted(true);
  };

  const reset = () => {
    setIsSubmitted(false);
  };

  return {
    isSubmitted,
    submit,
    reset,
  };
}
