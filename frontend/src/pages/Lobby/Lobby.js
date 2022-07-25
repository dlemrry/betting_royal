import React from "react";
import LobbyApp from "../../LobbyApp";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Mypage from "../../pages/MyPage/Mypage";
import Friend from "../../pages/Friend/Friend";
import Notice from "../../pages/Notice/Notice";
import Ranking from "../../pages/Ranking/Ranking";
import Guild from "../../pages/Guild/Guild";
import Replay from "../../pages/Replay/Replay";
import Tutorial from "../../pages/Tutorial/Tutorial";
import { dashboardTheme } from "../../dashboardTheme";
import Rooms from "../../pages/Rooms/Rooms";

export default function Lobby(props) {
  useEffect(() => {}, []);

  let sidemenu = (
    <ThemeProvider theme={dashboardTheme}>
      <LobbyApp />
      <Routes>
        <Route path="rooms" element={<Rooms />} />
        <Route path="mypage" element={<Mypage />} />
        <Route path="notice" element={<Notice />} />
        <Route path="friend" element={<Friend />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="guild" element={<Guild />} />
        <Route path="replay" element={<Replay />} />
        <Route path="tutorial" element={<Tutorial />} />
      </Routes>
    </ThemeProvider>
  );

  return sidemenu;
}
