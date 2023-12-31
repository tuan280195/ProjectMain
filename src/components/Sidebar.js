import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CustomerSearch from "./CustomerSearch";
import CustomerDetail from "./CustomerDetail";
import CaseSearch from "./CaseSearch";
import CaseDetail from "./CaseDetail";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const drawerWidth = 360;

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [customerOpen, setCustomerOpen] = React.useState(true);
  const [caseOpen, setCaseOpen] = React.useState(true);
  const [header, setHeader] = React.useState();
  const [caseId, setCaseDetail] = React.useState("");
  const [customerId, setCustomerDetail] = React.useState("");
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleClick = (item) => {
    setCaseDetail("");
    setCustomerDetail("");
    switch (item) {
      case "Customer":
        setCustomerOpen(!customerOpen);
        break;
      case "Search Customer":
        setHeader("顧客情報の検索");
        break;
      case "Create Customer":
        setHeader("顧客情報");
        break;
      case "Case":
        setCaseOpen(!caseOpen);
        break;
      case "Search Case":
        setHeader("案件の検索");
        break;
      case "Create Case":
        setHeader("案件情報");
        break;
      default:
        setHeader("Home");
        break;
    }
  };

  const hoverButton = {
    "&:hover": {
      backgroundColor: "#11596F",
      color: "#fff",
    },
    "&:active": {
      backgroundColor: "#0E563B",
    },
    "&:hover .MuiListItemIcon-root": {
      color: "#fff",
    },
  };
  const hoverChildButton = { ...hoverButton, pl: 4 };

  const logOut = () => {
    localStorage.removeItem("AuthToken");
    navigate('/login', { replace: true });
  };
  
  const drawer = (
    <div style={{ color: "#11596f", fontFamily: "inherit" }}>
      <Toolbar>
        <ListItemButton sx={{ maxWidth: "10rem" }} onClick={logOut}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="ログアウト"></ListItemText>
        </ListItemButton>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => handleClick("Customer")}
          sx={hoverButton}
        >
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="顧客情報管理"></ListItemText>
          {customerOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={customerOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={hoverChildButton}
              onClick={() => handleClick("Search Customer")}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="顧客情報の検索" />
            </ListItemButton>
            <ListItemButton
              sx={hoverChildButton}
              onClick={() => handleClick("Create Customer")}
            >
              <ListItemIcon>
                <AddBusinessIcon />
              </ListItemIcon>
              <ListItemText primary="顧客情報の新規作成" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <List>
        <ListItemButton onClick={() => handleClick("Case")} sx={hoverButton}>
          <ListItemIcon>
            <BusinessCenterIcon />
          </ListItemIcon>
          <ListItemText primary="案件管理"></ListItemText>
          {caseOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={caseOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={hoverChildButton}
              onClick={() => handleClick("Search Case")}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="案件の検索" />
            </ListItemButton>
            <ListItemButton
              sx={hoverChildButton}
              onClick={() => handleClick("Create Case")}
            >
              <ListItemIcon>
                <AddBusinessIcon />
              </ListItemIcon>
              <ListItemText primary="案件の新規作成" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ color: "#11596f", backgroundColor: "#fff" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h3"
            noWrap
            component="div"
            sx={{
              fontWeight: "bold",
              lineHeight: "180%",
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            {header}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "100px",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {header === "顧客情報の検索" && (
          <CustomerSearch
            setHeader={setHeader}
            setCustomerDetail={setCustomerDetail}
          />
        )}
        {header === "顧客情報" && <CustomerDetail customerId={customerId} />}
        {header === "案件の検索" && (
          <CaseSearch setHeader={setHeader} setCaseDetail={setCaseDetail} />
        )}
        {header === "案件情報" && <CaseDetail caseId={caseId} />}
      </Box>
    </Box>
  );
};

export default Sidebar;
