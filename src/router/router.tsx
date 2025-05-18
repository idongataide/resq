import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import OnboardingLayout from "../layouts/OnboardingLayout";
import Login from "../pages/auth/login/login";
import AuthPath from "../pages/auth/authPath";
import LoadingScreen from "../pages/dashboard/common/LoadingScreen";
import MainRouter from "./mainRouter";

const DashboadScreen = lazy(() =>
  import("../pages/dashboard/screens/dashboardScreen/DashboadScreen")
);
const TransactionsLayout = lazy(() =>
  import("../pages/dashboard/screens/transactions/transactiosLayout")
);
const BookingCategory = lazy(() =>
  import("../pages/dashboard/screens/bookings/bookingCategory")
);
const BookingTable = lazy(() =>
  import("../pages/dashboard/screens/bookings/bookingTable")
);
const OperationsLayout = lazy(() => 
  import("../pages/dashboard/screens/operations/operationsLayout")
);
const AddOperatorLayout = lazy(() => 
  import("@/pages/dashboard/screens/operations/addOperatorsLayout")
);
const RoadRescue = lazy(() => 
  import("@/pages/dashboard/screens/operations/roadRescue/roadRescue")
);  
const TeamsLayout = lazy(() => 
  import("@/pages/dashboard/screens/teams/teamsLayout")
);    
const AddTeams = lazy(() => 
  import("@/pages/dashboard/screens/teams/addTeams")
);    
const CustomersLayout = lazy(() => 
  import("@/pages/dashboard/screens/customers/customersLayout")
);    


export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainRouter />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboadScreen />
          </Suspense>
        ),
      },
      {
        path: "/home",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboadScreen />
          </Suspense>
        ),
      },
      {
        path: "/transactions",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <TransactionsLayout />
          </Suspense>
        ),
      },
      {
        path: "/bookings",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <BookingCategory />
              </Suspense>
            ),
          },
          {
            path: "/bookings",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <BookingCategory />
                  </Suspense>
                ),
              },
              {
                path: ":status",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <BookingTable />
                  </Suspense>
                ),
              },          
            ],
          },  
          
        ],
      },
      {
        path: "/operators",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OperationsLayout />
          </Suspense>
        ),
      },
      {
        path: "/operators/add",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AddOperatorLayout />
          </Suspense>
        ),
      },
      {
        path: "/operators/roadrescue/:id",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RoadRescue />
          </Suspense>
        ),
      },
      {
        path: "/teams",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <TeamsLayout />
          </Suspense>
        ),
      },
      {
        path: "/teams/add",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AddTeams />
          </Suspense>
            ),
      },
      {
        path: "/customers",
        element:(
          <Suspense fallback={<LoadingScreen/>}>
            <CustomersLayout/>
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <div>Work in Progress</div>,
      },
    ],
  },

  {
    path: "/login",
    element: <OnboardingLayout />,
    children: [
      { index: true, element: <Login />},
      { path: "forgot-password", element: <AuthPath /> },

    ],
  },

  {
    path: "*",
    element: <>Invalid Route</>,
  },
]);

