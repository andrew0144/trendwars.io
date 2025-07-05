import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './pages/Error.page';
import { HomePage } from './pages/Home.page';
import LobbyPage from './pages/Lobby.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'lobby/:id',
    element: <LobbyPage />,
    errorElement: <ErrorPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
