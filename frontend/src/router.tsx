import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Layout from "./pages/Layout"
import DashboardPage from "./pages/DashboardPage"
import ReadersPage from "./pages/ReadersPage"
import BooksPage from "./pages/BooksPage"
import LendingPage from "./pages/LendingsPage"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
       { path: "/dashboard/readers", element: <ReadersPage /> },
       { path: "/dashboard/books", element: <BooksPage /> },
       { path: "/dashboard/lending", element: <LendingPage /> },
       
    ],
  },
])

export default router
