const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className="notification">{message}</div>;
};

const ErrorNotification = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className="error">{message}</div>;
};

export { Notification, ErrorNotification };
