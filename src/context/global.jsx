import React from "react";

export const Global = React.createContext(null);
Global.displayName = "GlobalContext";

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    default: {
      throw new Error(`Unhandled action`);
    }
  }
}

export function GlobalControllerProvider({ children }) {
  const initialState = {
    openSidenav: false,
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    <Global.Provider value={value}>
      {children}
    </Global.Provider>
  );
}

export function useGlobalController() {
  const context = React.useContext(Global);

  if (!context) {
    throw new Error(
      "Error. Global provider"
    );
  }

  return context;
}

GlobalControllerProvider.displayName = "/src/context/global.jsx";


export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
