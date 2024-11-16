import "./App.css";
import Router from "./Router.tsx";
import { UserProvider } from './contexts/UserContext.tsx';

function App() {
  return (
    <UserProvider>
      <Router />
    </UserProvider>
  );
}

export default App;
