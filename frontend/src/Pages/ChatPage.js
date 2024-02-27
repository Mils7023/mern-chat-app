import React from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import SideDrawer from "../Components/misc/SideDrawer";

const ChatPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box>
        {/* {user && <MyChats />} */}
        {/* {user && <ChatBox />} */}
      </Box>
    </div>
  );
};

export default ChatPage;
