import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const Home = lazy(() => import("./Home"));
const Register = lazy(() => import("./Register"));
const Login = lazy(() => import("./Login"));
import { CircularProgress } from '@mui/material';

const App = () => {
  const CenteredCircularProgress = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <CircularProgress size={40} />
    </div>
  );
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route
            path="/"
            element={
              <Suspense fallback={<CenteredCircularProgress />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="Login"
            element={
              <Suspense fallback={<CenteredCircularProgress />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="Home"
            element={
              <Suspense fallback={<CenteredCircularProgress />}>
                <Home />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
      
    </>
  );
};

export default App;