import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet, useLocation } from "react-router-dom";

const drawerWidth = 200;

const Layout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // títulos de acordo com a rota
  const titulos = {
    "/": "Cadastro de Peças",
    "/lista": "Listagem de Peças",
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <List>
        <ListItem button component={Link} to="/" onClick={() => setOpen(false)}>
          <ListItemText primary="Cadastro" />
        </ListItem>
        <ListItem button component={Link} to="/lista" onClick={() => setOpen(false)}>
          <ListItemText primary="Listagem" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Botão menu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Título da página */}
          <Typography variant="h6" noWrap component="div">
            {titulos[location.pathname] || "Minha Loja de Tecidos"}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }} // performance no mobile
      >
        {drawerContent}
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 8 }} // mt=8 para empurrar abaixo do AppBar
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
