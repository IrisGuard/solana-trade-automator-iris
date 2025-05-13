
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard"; 
import Wallet from "@/pages/Wallet";
import Security from "@/pages/Security";
import Transactions from "@/pages/Transactions";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";

console.log("Routes module loaded");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "wallet",
        element: <Wallet />,
      },
      {
        path: "security",
        element: <Security />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "help",
        element: <Help />,
      },
    ],
  },
]);

export function Routes() {
  console.log("Routes component rendering");
  return <RouterProvider router={router} />;
}
