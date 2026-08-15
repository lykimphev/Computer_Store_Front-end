import { AppRoutes } from './app/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/**
 * MAIN APPLICATION COMPONENT (Teacher's Clean Pattern)
 * ===================================================
 * App renders AppRoutes directly. All layout routing and page views
 * are cleanly handled inside AppRoutes via React Router <Outlet />!
 */
export function App() {
  return <AppRoutes />;
}

export default App;
