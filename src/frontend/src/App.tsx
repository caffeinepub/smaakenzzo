import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import BottomNav from "./components/BottomNav";
import { CartProvider } from "./context/CartContext";
import CounterPage from "./pages/CounterPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import PayBillPage from "./pages/PayBillPage";

function CustomerLayout() {
  return (
    <div className="relative max-w-[480px] mx-auto min-h-screen">
      <Outlet />
      <BottomNav />
      <Toaster position="top-center" />
    </div>
  );
}

function CounterLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
      <Toaster position="top-center" />
    </div>
  );
}

const rootRoute = createRootRoute();

const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "customer-layout",
  component: CustomerLayout,
});

const counterLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "counter-layout",
  component: CounterLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/",
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/menu",
  component: MenuPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/orders",
  component: OrdersPage,
});

const payBillRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/pay-bill",
  component: PayBillPage,
});

const counterRoute = createRoute({
  getParentRoute: () => counterLayoutRoute,
  path: "/counter",
  component: CounterPage,
});

const routeTree = rootRoute.addChildren([
  customerLayoutRoute.addChildren([
    homeRoute,
    menuRoute,
    ordersRoute,
    payBillRoute,
  ]),
  counterLayoutRoute.addChildren([counterRoute]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
