import { useState } from "react";
import type { Route } from "./+types/chat";
import { Sidebar } from "../components/chat/sidebar";
import { MessageArea } from "../components/chat/message-area";
import { MessageInput } from "../components/chat/message-input";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat - VibeSync" },
    { name: "description", content: "Chat with your friends on VibeSync" },
  ];
}

// Mock data
const currentUser = {
  name: "John Doe",
};

const mockContacts = [
  { id: 1, name: "Sarah Johnson", online: true },
  { id: 2, name: "Mike Chen", online: true },
  { id: 3, name: "Emma Wilson", online: false },
  { id: 4, name: "Alex Rodriguez", online: false },
  { id: 5, name: "Lisa Anderson", online: true },
];

const initialMessages = [
  {
    id: 1,
    sender: "other" as const,
    text: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    senderName: "Sarah Johnson",
  },
  {
    id: 2,
    sender: "me" as const,
    text: "I'm doing great! Just working on some projects. How about you?",
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    sender: "other" as const,
    text: "Same here! I've been learning React Router lately.",
    timestamp: "10:33 AM",
    senderName: "Sarah Johnson",
  },
  {
    id: 4,
    sender: "me" as const,
    text: "That's awesome! It's a great framework.",
    timestamp: "10:35 AM",
  },
  {
    id: 5,
    sender: "other" as const,
    text: "Yeah, I'm really enjoying it. The new features are amazing!",
    timestamp: "10:36 AM",
    senderName: "Sarah Johnson",
  },
];

export default function Chat() {
  const [activeContactId, setActiveContactId] = useState(1);
  const [messages, setMessages] = useState(initialMessages);

  const activeContact = mockContacts.find((c) => c.id === activeContactId)!;

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: messages.length + 1,
      sender: "me" as const,
      text,
      timestamp: "Just now",
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        currentUser={currentUser}
        activeContactId={activeContactId}
        onContactSelect={setActiveContactId}
      />
      <div className="flex-1 flex flex-col">
        <MessageArea
          contactName={activeContact.name}
          contactOnline={activeContact.online}
          messages={messages}
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
