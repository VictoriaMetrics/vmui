import React, {FC} from "react";
import {SnackbarProvider} from "./contexts/Snackbar";
import HomeLayout from "./components/Home/HomeLayout";
import {StateProvider} from "./state/StateContext";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";

// pick a date util library
import DayJsUtils from "@date-io/dayjs";

const App: FC = () => {

  const THEME = createMuiTheme({
    typography: {
      "fontSize": 10
    }
  });

  return (
    <>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DayJsUtils}>
        <MuiThemeProvider theme={THEME}>
          <StateProvider>
            <SnackbarProvider>
              <HomeLayout/>
            </SnackbarProvider>
          </StateProvider>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    </>
  );
};

export default App;
