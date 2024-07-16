import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { createAxios } from "@/configs/axios";
import { UserContextConstants } from "./constants";
import { useNavigate } from 'react-router-dom';
export const User = React.createContext(null);
User.displayName = "UserContext";

export function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case UserContextConstants.SET_USER: {
      return {
        ...state,
        fullName: payload.fullName,
        email: payload.email,
        avatarUrl: payload.avatarUrl,
        charPerRequest: payload.charPerRequest,
        charPerMonth: payload.charPerMonth,
        messagePerDay: payload.chatGpt,
        premiumId: payload.premiumId,
      };
    }
    case UserContextConstants.SET_CHAR_PER_REQUSET: {
      const { charPerRequest } = state;
      return {
        ...state,
        charPerRequest: charPerRequest - payload
      };
    }
    case UserContextConstants.SET_CHAR_PER_MONTH: {
      const { charPerMonth } = state;
      return {
        ...state,
        charPerMonth: charPerMonth - payload
      };
    }
    case UserContextConstants.SET_MESSAGE: {
      const { messagePerDay } = state;
      return {
        ...state,
        messagePerDay: messagePerDay - payload
      };
    }
    case UserContextConstants.SET_LOADING_OVERLAY: {
      return {
        ...state,
        loadingOverlay: payload
      };
    }
    case UserContextConstants.SET_PREMIUM_ID: {
      return {
        ...state,
        premiumId: payload
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function UserControllerProvider({ children }) {
  const initialState = {
    fullName: "",
    email: "",
    avatarUrl: "",
    charPerRequest: 0,
    charPerMonth: 0,
    messagePerDay: 0,
    loadingOverlay: false,
    premiumId: 0,
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    <User.Provider value={value}>
      {children}
    </User.Provider>
  );
}

export function useUserController() {
  const context = React.useContext(User);
  if (!context) {
    throw new Error(
      "useController should be used inside UserControllerProvider."
    );
  }

  return context;
}

UserControllerProvider.displayName = "/src/context/user.jsx";

UserControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const setCharPerRequest = (dispatch, payload) =>
  dispatch({ type: UserContextConstants.SET_CHAR_PER_REQUSET, payload });
export const setCharPerMonth = (dispatch, payload) =>
  dispatch({ type: UserContextConstants.SET_CHAR_PER_MONTH, payload });
export const setMessage = (dispatch, payload) =>
  dispatch({ type: UserContextConstants.SET_MESSAGE, payload });
export const setUser = (dispatch, payload) =>
  dispatch({ type: UserContextConstants.SET_USER, payload });
export const setLoadingOverlay = (dispatch, payload) =>
  dispatch({ type: UserContextConstants.SET_LOADING_OVERLAY, payload });
export const setPremiumId = (dispatch, payload) =>
  dispatch({ type: UserContextConstants.SET_PREMIUM_ID, payload });