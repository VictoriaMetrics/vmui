import React, {createContext, FC, useContext, useEffect, useState} from 'react';
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

export interface SnackModel {
  message?: string;
  color?: string;
  open?: boolean;
  key?: number;
}

export const SnackbarContext = createContext<{ showInfoMessage: (value: string) => void }>({
  showInfoMessage: () => {}
});

export const useSnack = () => useContext(SnackbarContext);

export const SnackbarProvider: FC = ({children}) => {
  const [snack, setSnack] = useState<SnackModel>({});
  const [open, setOpen] = useState(false);

  const [infoMessage, setInfoMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (infoMessage) {
      setSnack({
        message: infoMessage,
        key: new Date().getTime()
      });
      setOpen(true);
    }
  }, [infoMessage])

  const handleClose = (event?: React.SyntheticEvent, reason?: string): void => {
    setInfoMessage(undefined);
    setOpen(false);
  };

  return <SnackbarContext.Provider value={{showInfoMessage: setInfoMessage}}>
    <Snackbar open={open} key={snack.key} autoHideDuration={4000} onClose={handleClose}>
      <Alert>
        {snack.message}
      </Alert>
    </Snackbar>
    {children}
  </SnackbarContext.Provider>
}


