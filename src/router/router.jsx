import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import ErrorPage from "@/pages/ErrorPage";
import HomePage from "@/pages/HomePage";
import VehiclePage from "@/pages/VehiclePage";
import RoutePage from "@/pages/RoutePage";
import ResultPage from "@/pages/ResultPage";
import NotificationPage from "@/pages/NotificationPage";
import RouteAnalysisResults from "@/pages/RouteAnalysisResults";
import AuthLayout from "@/layout/AuthLayout";
import LoginPage from "@/pages/AuthPages/LoginPage";
import RegisterPage from "@/pages/AuthPages/RegisterPage";
import RegisterOTPVerify from "@/pages/AuthPages/RegisterOTPVerify";
import RegisterSuccessPage from "@/pages/AuthPages/RegisterSuccessPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  // Auth Pages
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "otp-verify",
        element: <RegisterOTPVerify />,
      },
      {
        path: "register-success",
        element: <RegisterSuccessPage />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "vechile",
        element: <VehiclePage />,
      },
      {
        path: "route",
        element: <RoutePage />,
      },
      {
        path: "result",
        element: <ResultPage />,
      },
      {
        path: "route-analysis-results",
        element: <RouteAnalysisResults />,
      },
      // {
      //   path: "notification",
      //   element: <NotificationPage />,
      // },
    ],
  },
]);

export default router;
