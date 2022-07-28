import React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { mainMyPageItems, mainNavbarItems, mainTutorialItems} from './consts/navbarListItems';
import { useNavigate } from "react-router-dom";
import { navbarStyles } from './styles';
import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";

const Navbar = (title) => {

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {}, []);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  
    const navigate = useNavigate();

    return(
        <Drawer
          sx={navbarStyles.drawer}
          variant="permanent"
          anchor="left">
        <Toolbar />
        <List>
            {mainMyPageItems.map((item, index) => (
                <ListItem button key={item.id} onClick={() => navigate(item.route)}>
                  {/* <ListItemIcon sx={navbarStyles.icons}>
                    {item.icon}
                  </ListItemIcon> */}
                  <ListItemText
                    sx={navbarStyles.text} primary={item.label}/>
                </ListItem>
              ))}
              <button onClick={ openModal }>금고</button>
              <Modal open={ modalOpen } close={ closeModal } header="루비금고">
            <button>입금</button>
            <button>출금</button>
          </Modal>
        </List>
        <Divider />
        <List>
           {mainNavbarItems.map((item, index) => (
              <ListItem button key={item.id} onClick={() => navigate(item.route)}>
              <ListItemIcon sx={navbarStyles.icons}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                sx={navbarStyles.text} primary={item.label}/>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
           {mainTutorialItems.map((item, index) => (
              <ListItem button key={item.id} onClick={() => navigate(item.route)}>
              {/* <ListItemIcon sx={navbarStyles.icons}>
                {item.icon}
              </ListItemIcon> */}
              <ListItemText
                sx={navbarStyles.text} primary={item.label}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
    )
}

export default Navbar;