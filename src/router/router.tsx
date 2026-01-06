import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import OnboardingLayout from "../layouts/OnboardingLayout";
import Login from "../pages/auth/login/login";
import AuthPath from "../pages/auth/authPath";
import LoadingScreen from "../pages/dashboard/common/LoadingScreen";
import MainRouter from "./mainRouter";
import BPDListing from "@/pages/dashboard/screens/setup/BPD/BPDListing";
import CommandCenter from "@/pages/dashboard/screens/setup/commandCenter/CommandLayout";

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

const AdminsLayout = lazy(() => 
  import("@/pages/dashboard/screens/lastmadmin/adminsLayout")
);    

const AddTeams = lazy(() => 
  import("@/pages/dashboard/screens/teams/addTeams")
);    
const AddLatsmaAdmin = lazy(() => 
  import("@/pages/dashboard/screens/lastmadmin/addTeams")
);    
const AddLastmaLayout = lazy(() => 
  import("@/pages/dashboard/screens/teams/addLastma")
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
const GeneralCostLayout = lazy(() => 
  import("@/pages/dashboard/screens/setup/generalCostPoints/generalLayout")
);    
const StakeHolderLayout = lazy(() =>
  import("@/pages/dashboard/screens/setup/stakeHolder/stakeHolderLayout")
);
const ServiceCost = lazy(() =>
  import("@/pages/dashboard/screens/setup/serviceCost/ServiceCost")
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
        path: "/admins",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminsLayout />
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
            path: "general-cost-points",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <GeneralCostLayout />
              </Suspense>
            ),
          },
          {
            path: "stakeholder-disbursement",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <StakeHolderLayout />
              </Suspense>
            ),
          },
          {
            path: "services-cost",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <ServiceCost />
              </Suspense>
            ),
          },
          {
            path: "command-center",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <CommandCenter />
              </Suspense>
            ),
          },
          {
            path: "business-process-documentation",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <BPDListing />
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
        path: "/teams/add-lastma",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AddLastmaLayout />
          </Suspense>
            ),
      },
      {
        path: "/admins/add",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AddLatsmaAdmin />
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

