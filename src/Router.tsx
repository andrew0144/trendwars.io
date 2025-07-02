import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { ErrorPage } from './pages/Error.page';
import LobbyPage from './pages/Lobby.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'lobby/',
    element: <ErrorPage />,
  },
  {
    path: 'lobby/:id',
    element: <LobbyPage />,
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
