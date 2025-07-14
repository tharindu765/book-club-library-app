import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Layout from "./pages/Layout"
import DashboardPage from "./pages/DashboardPage"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/dashboard", element: <DashboardPage /> }
    ],
  },
])

export default router
