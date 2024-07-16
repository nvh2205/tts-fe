import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { AudioContextConstants } from "./constants";
export const Audio = React.createContext(null);
Audio.displayName = "AudioContext";

export function reducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case AudioContextConstants.SET_AUDIO_INFO: {
            return {
                ...state,
                text: payload.text,
                speaker: payload.speaker,
                id: payload.id,
                linkAudio: payload.linkAudio,
            };
        }
        case AudioContextConstants.SET_LINK_AUDIO: {
            return {
                ...state,
                linkAudio: payload,
            };
        }
        case AudioContextConstants.SET_IS_PLAY: {
            return {
                ...state,
                isPlay: payload,
            };
        }
        case AudioContextConstants.SET_LIST_HISTORY_AUDIOS: {
            return {
                ...state,
                listHistoryAudios: payload,
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

export function AudioControllerProvider({ children }) {
    const initialState = {
        text: '',
        speaker: '',
        linkAudio: '',
        id: 0,
        isPlay: false,
        listHistoryAudios: [],
    };

    const [controller, dispatch] = React.useReducer(reducer, initialState);
    const value = React.useMemo(
        () => [controller, dispatch],
        [controller, dispatch]
    );

    return (
        <Audio.Provider value={value}>
            {children}
        </Audio.Provider>
    );
}

export function useAudioController() {
    const context = React.useContext(Audio);
    if (!context) {
        throw new Error(
            "Error audio context must be used within a AudioControllerProvider"
        );
    }

    return context;
}

AudioControllerProvider.displayName = "/src/context/audio.jsx";

AudioControllerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const setAudioInfo = (dispatch, payload) =>
    dispatch({ type: AudioContextConstants.SET_AUDIO_INFO, payload });

export const setLinkAudio = (dispatch, payload) =>
    dispatch({ type: AudioContextConstants.SET_LINK_AUDIO, payload });

export const setIsPlay = (dispatch, payload) =>
    dispatch({ type: AudioContextConstants.SET_IS_PLAY, payload });

export const setListHistoryAudios = (dispatch, payload) =>
    dispatch({ type: AudioContextConstants.SET_LIST_HISTORY_AUDIOS, payload });