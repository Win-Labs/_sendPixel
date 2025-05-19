import Canvas from "./pages/Canvas";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "./pages/Root";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          //@ts-ignore
          index: "true",
          path: "canvas/:canvasId",
          element: <Canvas />,
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransition: true,
    },
  },
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
