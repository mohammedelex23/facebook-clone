import { Login } from "./routes/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import { Signup } from "./routes/Signup";
import { AfterSignup } from "./routes/AfterSignup";
import { ProtectedAfterSignup } from "./components/ProtectedAfterSignup";
import React from "react";
import { Verify } from "./routes/Verify";
import { ProtectedVerify } from "./components/ProtectedVerify";
import { Home } from "./routes/Home";
import { ProtectedAuth } from "./components/ProtectedAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedAuth>
          <Login />
        </ProtectedAuth>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <ProtectedAuth>
          <Signup />
        </ProtectedAuth>
      ),
    },
    {
      path: "/check_email",
      element: (
        <ProtectedAfterSignup>
          <AfterSignup />
        </ProtectedAfterSignup>
      ),
    },
    {
      path: "/verify",
      element: (
        <ProtectedVerify>
          <Verify />
        </ProtectedVerify>
      ),
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
