import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Admin from "./components/Admin";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import LinkPage from "./components/LinkPage";
import RequireAuth from "./components/RequireAuth";
import CustomerDetail from "./components/CustomerDetail";
import CustomerManagement from "./components/CustomerManagement";
import { Routes, Route } from "react-router-dom";
import CustomerSearch from "./components/CustomerSearch";
import CaseManagement from "./components/CaseManagement";
import CaseSearch from "./components/CaseSearch";

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Home />} />
        <Route path="/customermanagement" element={<CustomerManagement />} />
        <Route
          path="/customermanagement/customerdetail"
          element={<CustomerDetail />}
        />
        <Route
          path="/customermanagement/customersearch"
          element={<CustomerSearch />}
        />
        <Route path="/casemanagement" element={<CaseManagement />}></Route>
        <Route
          path="/casemanagement/casesearch"
          element={<CaseSearch />}
        ></Route>
        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>
        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
