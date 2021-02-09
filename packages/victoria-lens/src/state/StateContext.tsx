import React, {createContext, Dispatch, FC, useContext, useMemo, useReducer} from "react";
import {Action, AppState, initialState, reducer} from "./reducer";

type StateContextType = { state: AppState, dispatch: Dispatch<Action> };

export const StateContext = createContext<StateContextType>({} as StateContextType);

export const useAppState = (): AppState => useContext(StateContext).state;
export const useAppDispatch = (): Dispatch<Action> => useContext(StateContext).dispatch;

export const StateProvider: FC = ({children}) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);


  return <StateContext.Provider value={contextValue}>
    {children}
  </StateContext.Provider>;
};


