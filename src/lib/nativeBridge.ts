"use client";

import { useEffect, useState } from "react";

// Define the type for the React Native WebView window object
declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}

export type NativeMessageType = "AUTH_STATE_CHANGE" | "NAVIGATION" | "NOTIFICATION";

export interface NativeMessage {
    type: NativeMessageType;
    payload?: any;
}

/**
 * Sends a message to the React Native app
 */
export const sendToNative = (type: NativeMessageType, payload?: any) => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
    }
};

/**
 * Hook to listen for messages from the React Native app
 */
export const useNativeBridge = () => {
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        // Check if running in a WebView
        setIsNative(!!window.ReactNativeWebView);

        const handleMessage = (event: MessageEvent) => {
            try {
                // Handle messages from native app if needed
                // const data = JSON.parse(event.data);
                console.log("Received from native:", event.data);
            } catch (error) {
                console.error("Error parsing native message:", error);
            }
        };

        // In React Native WebView, messages might come differently depending on implementation
        // Standard window.postMessage or document events
        window.addEventListener("message", handleMessage);
        document.addEventListener("message", handleMessage as any); // For iOS/Android specific handling

        return () => {
            window.removeEventListener("message", handleMessage);
            document.removeEventListener("message", handleMessage as any);
        };
    }, []);

    return { isNative, sendToNative };
};
