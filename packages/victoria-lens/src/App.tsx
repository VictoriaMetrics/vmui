import React, {FC} from "react";
import {SnackbarProvider} from "./contexts/Snackbar";
import HomeLayout from "./components/Home/HomeLayout";

const App: FC = () => {

  return (
    <SnackbarProvider>
      <HomeLayout/>
    </SnackbarProvider>
  );
};

export default App;
