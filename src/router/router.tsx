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

const RevenueLayout = lazy(() => 
  import("@/pages/dashboard/screens/revenue/RevenueLayout")
);   

const SetupCategories = lazy(() => 
  import("@/pages/dashboard/screens/setup/SetupCategories")
);    



// Account components
const AccountLayout = lazy(() => import("@/pages/dashboard/screens/account/AccountLayout"));
const Profile = lazy(() => import("@/pages/dashboard/screens/account/Profile"));
const ChangePassword = lazy(() => import("@/pages/dashboard/screens/account/ChangePassword"));
const Passcode = lazy(() => import("@/pages/dashboard/screens/account/Passcode"));

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
        path: "/revenue",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RevenueLayout />
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
        path: "/setup",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <SetupCategories />
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
        path: "/account",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AccountLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Profile /> }, // Default route for /account
          { path: 'change-password', element: <ChangePassword /> },
          { path: 'passcode', element: <Passcode /> },
          // Add routes for Notifications and FAQs when components are created
        ],
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

