import React, {FC} from "react";
import {SnackbarProvider} from "./contexts/Snackbar";
import HomeLayout from "./components/Home/HomeLayout";
import {StateProvider} from "./state/StateContext";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

const App: FC = () => {

  const THEME = createMuiTheme({
    typography: {
      "fontSize": 10
    }
  });

  return (
    <>
      <CssBaseline />
      <MuiThemeProvider theme={THEME}>
        <StateProvider>
          <SnackbarProvider>
            <HomeLayout/>
          </SnackbarProvider>
        </StateProvider>
      </MuiThemeProvider>
    </>
  );
};

export default App;
