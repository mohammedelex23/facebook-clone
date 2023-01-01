import { Login } from "./routes/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import { Signup } from "./routes/Signup";
import { AfterSignup } from "./routes/AfterSignup";
import { ProtectedAfterSignup } from "./components/ProtectedAfterSignup";
import React, { useState } from "react";
import { Verify } from "./routes/Verify";
import { ProtectedVerify } from "./components/ProtectedVerify";
import { Home } from "./routes/Home";
import { ProtectedAuth } from "./components/ProtectedAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Friendship } from "./routes/Friendship";
import { Search } from "./routes/Search";
import { Messages } from "./routes/Messages";
import { Menu } from "./routes/Menu";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { PostIdContext, SocketContext } from "./context/contexts";
import { io } from "socket.io-client";
import authHelpers from "./helpers/authHelpers";
import { Provider } from "react-redux";
import store from "./redux";
import Profile from "./routes/Profile";
import Message from "./components/Message";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const socket = io("http://localhost:5000");

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
      path: "/user",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute key={5} name="home">
          <Home />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/home/friends",
          element: (
            <ProtectedRoute key={1} name="friends">
              <Friendship />
            </ProtectedRoute>
          ),
        },
        {
          path: "/home/search",
          element: (
            <ProtectedRoute key={2} name="search">
              <Search />
            </ProtectedRoute>
          ),
        },
        {
          path: "/home/messages",
          element: (
            <ProtectedRoute key={3} name="messages">
              <Messages />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/home/messages/user",
              element: <Message />,
            },
          ],
        },
        {
          path: "/home/menu",
          element: (
            <ProtectedRoute key={4} name="menu">
              <Menu />
            </ProtectedRoute>
          ),
        },
      ],
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
  const [selectedPostId, setSelectedPostId] = useState("");
  return (
    <QueryClientProvider client={client}>
      <PostIdContext.Provider value={{ selectedPostId, setSelectedPostId }}>
        <SocketContext.Provider value={socket}>
          <Provider store={store}>
            <RouterProvider router={router} />
          </Provider>
        </SocketContext.Provider>
      </PostIdContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
