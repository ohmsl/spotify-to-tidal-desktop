import { Alert, AlertProps, Snackbar } from "@mui/material";
import React, { useState } from "react";

interface AlertProviderProps {
  children: React.ReactNode;
}

export type AlertType = {
  message: string;
  severity: "error" | "warning" | "info" | "success";
  alertProps?: AlertProps;
};

export type AlertContextType = {
  sendAlert: (alert: AlertType) => void;
};

export const AlertContext = React.createContext<AlertContextType>({
  sendAlert: () => {},
});

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Array<AlertType & { open: boolean }>>(
    []
  );

  const handleClose = () => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => ({ ...alert, open: false }))
    );
  };

  const sendAlert = (alert: AlertType) => {
    setAlerts((prevAlerts) => [...prevAlerts, { ...alert, open: true }]);
  };

  return (
    <AlertContext.Provider value={{ sendAlert }}>
      {alerts.map((alert, index) => (
        <Snackbar
          open={alert.open}
          autoHideDuration={
            process.env.NODE_ENV === "development" ? null : 6000
          }
          onClose={handleClose}
        >
          <Alert
            key={index}
            severity={alert.severity}
            onClose={handleClose}
            {...alert.alertProps}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
      {children}
    </AlertContext.Provider>
  );
};
