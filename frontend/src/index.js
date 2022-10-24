import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Index } from "./routes/Index";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import { Signup } from "./routes/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
