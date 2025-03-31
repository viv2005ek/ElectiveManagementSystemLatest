import "./App.css";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import Router from "./Router.tsx";
import {UserProvider} from "./contexts/UserContext.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "./redux/store.ts";
import {useEffect} from "react";
import {fetchUser} from "./redux/slices/authSlice.ts";
import {ToastContainer} from "react-toastify";
import {NotificationProvider} from "./contexts/NotificationContext.tsx"; // Correct import here

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <UserProvider>
      <NotificationProvider>
        <Router />
        <ToastContainer position={"bottom-right"} />
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;
