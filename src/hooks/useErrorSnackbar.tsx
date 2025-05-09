import { useState } from 'react';
import ErrorSnackbar from '../components/ErrorSnackbar';

export default function useErrorSnackbar() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showError = (customMessage?: string) => {
    setMessage(customMessage);
    setVisible(true);
  };

  const hideError = () => {
    setVisible(false);
  };

  const errorSnackbar = () => {
    return (
      <ErrorSnackbar
        visible={visible}
        message={message}
        onHide={hideError}
      />
    );
  };

  return {
    showError,
    hideError,
    errorSnackbar,
    visible
  };
}