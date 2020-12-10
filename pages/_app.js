import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import "../styles/tailwind.css";

const theme = {
  colors: {
    primary: "black",
  },
  fontSizes: ["12pt", "16pt", "24pt", "32pt", "48pt", "64pt"],
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default MyApp;
