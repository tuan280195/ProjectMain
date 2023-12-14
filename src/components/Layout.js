import { Link, Outlet } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
