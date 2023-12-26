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

const drawerWidth = 360;

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [customerOpen, setCustomerOpen] = React.useState(true);
  const [caseOpen, setCaseOpen] = React.useState(true);
  const [header, setHeader] = React.useState("Home");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleClick = (item) => {
    console.log(item)
    switch (item) {
      case "Customer":
        setCustomerOpen(!customerOpen);
        break;
      case "Search Customer":
        setHeader(item);
        break;
      case "Create Customer":
        setHeader(item);
        break;
      case "Case":
        setCaseOpen(!caseOpen);
        break;
      case "Search Case":
        setHeader(item);
        break;
      case "Create Case":
        setHeader(item);
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
  };
  const hoverChildButton = { ...hoverButton, pl: 4 };

  const drawer = (
    <div style={{ color: "#11596f", fontFamily: "inherit" }}>
      <Toolbar />
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
              <ListItemText primary="Search Customer" />
            </ListItemButton>
            <ListItemButton
              sx={hoverChildButton}
              onClick={() => handleClick("Create Customer")}
            >
              <ListItemIcon>
                <AddBusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Create Customer" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <List>
        <ListItemButton onClick={() => handleClick("Case")} sx={hoverButton}>
          <ListItemIcon>
            <BusinessCenterIcon />
          </ListItemIcon>
          <ListItemText primary="Case"></ListItemText>
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
              <ListItemText primary="Search Case" />
            </ListItemButton>
            <ListItemButton
              sx={hoverChildButton}
              onClick={() => handleClick("Create Case")}
            >
              <ListItemIcon>
                <AddBusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Create Case" />
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
        {header === "Search Customer" && <CustomerSearch />}
        {header === "Create Customer" && <CustomerDetail />}
        {header === "Search Case" && <CaseSearch />}
        {header === "Create Case" && <CaseDetail />}
      </Box>
    </Box>
  );
};

export default Sidebar;
