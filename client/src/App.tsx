import "./App.css";
import Router from "./Router.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store.ts";
import { useEffect } from "react";
import { fetchUser } from "./redux/slices/authSlice.ts";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <UserProvider>
      <Router />
    </UserProvider>
  );
}

export default App;
