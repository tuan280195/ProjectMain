import { Link, Outlet } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const Layout = () => {
  return (
    <main className="App">
      <header className="app-header">
        <Link to="">
          <HomeIcon />
        </Link>
      </header>
      <Outlet />
    </main>
  );
};

export default Layout;
