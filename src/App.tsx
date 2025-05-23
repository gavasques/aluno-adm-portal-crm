import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthProvider } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";

const Home = lazy(() => import("@/pages/Home"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Account = lazy(() => import("@/pages/Account"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminPermissions = lazy(() => import("@/pages/admin/Permissions"));
const AdminSuppliers = lazy(() => import("@/pages/admin/Suppliers"));
const FixPermissions = lazy(() => import("@/pages/admin/FixPermissions"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/account",
        element: (
          <Suspense fallback={<Loading />}>
            <Account />
          </Suspense>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <Suspense fallback={<Loading />}>
            <AdminUsers />
          </Suspense>
        ),
      },
       {
        path: "/admin/permissions",
        element: (
          <Suspense fallback={<Loading />}>
            <AdminPermissions />
          </Suspense>
        ),
      },
      {
        path: "/admin/suppliers",
        element: (
          <Suspense fallback={<Loading />}>
            <AdminSuppliers />
          </Suspense>
        ),
      },
      {
        path: "/admin/fix-permissions",
        element: (
          <Suspense fallback={<Loading />}>
            <FixPermissions />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/signin",
    element: (
      <Suspense fallback={<Loading />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loading />}>
        <SignUp />
      </Suspense>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
