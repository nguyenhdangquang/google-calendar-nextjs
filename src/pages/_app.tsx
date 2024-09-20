import React from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import ContextWrapper from "../context/ContextWrapper";
import { environment_config } from "@/services/env-variables";
import AuthGuard from "@/components/AuthGuard";
import { store } from "@/store/store";
import "../styles/global.css";

export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  public?: boolean;
};

let persistor = persistStore(store);
const AUTH_GOOGLE_CLIENT_ID = environment_config.AUTH_GOOGLE_CLIENT_ID;
const MyApp = (props: AppProps) => {
  const {
    Component,
    pageProps,
  }: { Component: NextApplicationPage; pageProps: any } = props;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={AUTH_GOOGLE_CLIENT_ID}>
          <ContextWrapper>
            {Component.public ? (
              <Component {...pageProps} />
            ) : (
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            )}
          </ContextWrapper>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
