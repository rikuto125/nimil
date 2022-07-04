import type { AppProps } from "next/app";

import { Root } from "@nimil-jp/react-utils";

import modalState from "states/modalState";

import "styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Root modalState={modalState}>
      <Component {...pageProps} />
    </Root>
  );
}

export default MyApp;
