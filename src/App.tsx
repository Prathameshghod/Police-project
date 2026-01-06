import Home from "./pages/home";
import Login from "./pages/login";
import Service from "./pages/service";
import Telegramscan from "./pages/telegramscan";
import PanVerification from "./pages/panVerification";
import AddharLookup from "./pages/Addharlookup";
import PanToGst from "./pages/PantoGst";
import DirectorIntelegence from "./pages/DirectorIntelegence";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/telegramscan",
      element: < Telegramscan/>,
    },
    {
      path: "/service",
      element: <Service />,
    },
     {
      path: "/panVerification",
      element: <PanVerification/>,
    },
    {
      path: "/AddharLookup",
      element: <AddharLookup/>,
    },
    {
      path: "/PantoGst",
      element: <PanToGst/>,
    },
    {
      path: "/DirectorIntelegence",
      element: <DirectorIntelegence/>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
