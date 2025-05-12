
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Wallet from "@/pages/Wallet";
import Security from "@/pages/Security";
import Transactions from "@/pages/Transactions";
import TransactionsEnhanced from "@/pages/TransactionsEnhanced";
import Bots from "@/pages/Bots";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";

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
        path: "transactions-enhanced",
        element: <TransactionsEnhanced />,
      },
      {
        path: "bots",
        element: <Bots />,
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
  return <RouterProvider router={router} />;
}
