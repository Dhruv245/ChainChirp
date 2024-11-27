import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./home.css";
import { EthereumProvider } from "./context/EthereumContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient()


ReactDOM.render(
  <EthereumProvider >
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
              <App />
        </QueryClientProvider>
    </BrowserRouter>
  </EthereumProvider>,


  document.getElementById("root")
);
