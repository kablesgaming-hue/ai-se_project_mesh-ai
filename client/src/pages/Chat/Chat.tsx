import { useState } from "react";
import { getChats, createChat } from "../../utils/api";
import type { Chat as ChatType } from "../../utils/api";
import "./Chat.css";

export default function Chat() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  return <div>Chat</div>;
}