import React, {FC} from "react";
import {SnackbarProvider} from "./contexts/Snackbar";
import HomeLayout from "./components/Home/HomeLayout";
import {StateProvider} from "./state/StateContext";

const App: FC = () => {

  return (
    <StateProvider>
      <SnackbarProvider>
        <HomeLayout/>
      </SnackbarProvider>
    </StateProvider>
  );
};

export default App;
