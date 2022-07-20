import MicIcon from "@mui/icons-material/Mic";
import MoodIcon from "@mui/icons-material/Mood";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/firebase";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation, Imessage } from "../interface";
import {
  convertFirestoreTimestampToString,
  generateQuerryGetMessage,
  transformMesage,
} from "../utils/getMessagesInConversation";
import Message from "./Message";
import RecipientAvatar from "./RecipientAvatar";
import Spinner from "./Spinner";
const MessagesScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: Imessage[];
}) => {
  const [newMessage, setnewMesage] = useState("");
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const { recipient, recipientEmail } = useRecipient(conversation.users);
  const router = useRouter();
  const conversationId = router.query.id;
  const querryMessages = generateQuerryGetMessage(conversationId as string);
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
}
  useEffect(()=>{
    scrollToBottom()
  },[])
  const [mesagesSnapshot, getMesloading, __error] =
    useCollection(querryMessages);
  const showMessage = () => {
    if (getMesloading) {
      return messages.map((message) => (
        <Message key={message.id} message={message} />
      ));
    }
    if (mesagesSnapshot) {
      return mesagesSnapshot.docs.map((message) => (
        <Message key={message.id} message={transformMesage(message)} />
      ));
    }
    return null
  };

  const sendMessage = async () => {
    await setDoc(
      doc(db, "users", loggedInUser?.email as string),
      {
        email: loggedInUser?.email,
        lastSeen: serverTimestamp(),
        avatarURL: loggedInUser?.photoURL,
      },
      { merge: true }
    );
    await addDoc(collection(db, "messages"), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: loggedInUser?.email,
    });
    setnewMesage("");
    scrollToBottom()
  };

  const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!newMessage) return;
      sendMessage();

    }
  };
 
  if(!conversation || !messages) return <Spinner />
  return (
    <div className="w-full flex flex-col relative">
      <div className="flex justify-start p-3 gap-3 items-center bg-gray-50 border-solid border-gray-200 border-b-[1px]  sticky">
        <RecipientAvatar
          recipientEmail={recipientEmail}
          recipient={recipient}
        />
        <div className="flex flex-col gap-1">
          <div className="font-bold text-lg">{recipientEmail}</div>
          {recipient?.lastSeen && (
            <div className="text-sm text-gray-500 ">
              Last active:{" "}
              {convertFirestoreTimestampToString(recipient?.lastSeen)}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto max-h-[90vh]">
        {showMessage()}
        <div className="mb-[40px]" ref={endOfMessagesRef}></div>
      </div>

      <div className="absolute bottom-0 flex w-full z-20 p-1 bg-white">
        <IconButton>
          <MoodIcon />
        </IconButton>
        <input
          type="text"
          className="w-full bg-gray-200 outline-none rounded-lg p-2"
          onChange={(e) => setnewMesage(e.target.value)}
          placeholder="Aa"
          value={newMessage}
          onKeyDown={sendMessageOnEnter}
        />
        <IconButton onClick={sendMessage} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default MessagesScreen;
