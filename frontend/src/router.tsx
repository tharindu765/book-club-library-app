import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Layout from "./pages/Layout"
import DashboardPage from "./pages/DashboardPage"
import ReadersPage from "./pages/ReadersPage"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
       { path: "/dashboard/readers", element: <ReadersPage /> },
    ],
  },
])

export default router
