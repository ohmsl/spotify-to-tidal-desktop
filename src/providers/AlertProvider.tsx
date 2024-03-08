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
  addAlert: (alert: AlertType) => void;
};

export const AlertContext = React.createContext<AlertContextType>({
  addAlert: () => {},
});

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Array<AlertType>>([]);

  const handleClose = () => {
    setAlerts((prevAlerts) => prevAlerts.slice(1));
  };

  const addAlert = (alert: AlertType) => {
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {alerts.map((alert, index) => (
        <Snackbar
          open={alerts.length > 0}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            key={index}
            severity={alert.severity}
            onClose={handleClose}
            {...alert.alertProps}
          />
        </Snackbar>
      ))}
      {children}
    </AlertContext.Provider>
  );
};
