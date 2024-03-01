import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderDetails } from "../config/ChatLogics";
import ProfileModal from "./misc/ProfileModal";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";
import axios from "axios";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [newMessage, setNewMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const typingHandler = (event) => {
    setNewMessage(event.target.value);
  };

  const fetchChatHistory = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  const sendMessageHandler = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleString();
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              ></Spinner>
            ) : (
              messages.map((message, index) => (
                <Box
                  display="flex"
                  key={index}
                  color="#FFF"
                  borderRadius="md"
                  maxWidth="70%"
                  alignItems="center"
                  alignSelf={
                    message.sender._id === user._id ? "flex-end" : "flex-start"
                  }
                  p={2}
                  my={1}
                >
                  {message.sender._id !== user._id && (
                    <Avatar size="sm" name={message.sender.name} mr={2} />
                  )}
                  <Box>
                    <Text fontSize="xs" color="black" mr={1}>
                      {formatTime(message.createdAt)}
                    </Text>
                    <Text
                      bg={
                        message.sender._id === user._id ? "#69D2E7" : "#F38630"
                      }
                      padding="5px"
                      borderRadius={
                        message.sender._id === user._id
                          ? "10px 10px 0 10px"
                          : "0 10px 10px 10px"
                      }
                    >
                      {message.content}
                    </Text>
                  </Box>
                </Box>
              ))
            )}

            <FormControl
              display="flex"
              isRequired
              mt={3}
              onKeyDown={sendMessageHandler}
            >
              <Input
                placeholder="Enter a Message..."
                bg="#efefef"
                variant="filled"
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
