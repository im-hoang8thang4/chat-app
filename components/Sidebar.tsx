import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import * as EmailValidator from "email-validator";
import { addDoc, collection, query, where } from "firebase/firestore";
import { Conversation } from "../interface";
import ConversationSelectted from "./ConversationSelectted";

const Sidebar = () => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  const [openDialog, setopnenDialog] = useState(false);

  const [recipientEmail, setRecipientEmail] = useState("");

  const handleClose = () => {
    setopnenDialog(false);
    setRecipientEmail("");
  };
  // kiểm tra đoạn hội thoại đã tồn tại hay chưa
  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", loggedInUser?.email)
  );
  const [conversationSnapshot, __loading, __error] = useCollection(
    queryGetConversationsForCurrentUser
  );

  const isConversationAlreadyExists = (recipientEmail: string) =>
    conversationSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    );
  // kiểm tra có đang chat với chính mình không
  const isInvitingSelf = recipientEmail === loggedInUser?.email;
  // tạo cuộc hội thoại mới
  const createConversation = async () => {
    if (!recipientEmail) return;

    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      await addDoc(collection(db, "conversations"), {
        users: [loggedInUser?.email, recipientEmail],
      });
      handleClose();
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error", error);
    }
  };
  return (
    <div className="w-1/5 min-h-screen bg-gray-50 flex-col">
      <div className="flex justify-between p-3 border-solid border-gray-200 border-b-[1px]">
        <Tooltip title={loggedInUser?.email as string} placement="right">
          <Avatar
            alt="avatar"
            src={loggedInUser?.photoURL as string}
            className="cursor-pointer hover:opacity-80"
          />
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
      <div className="flex gap-1 bg-gray-50 items-center border-solid border-gray-200 border-b-[1px]">
        <SearchIcon className="ml-2" />
        <input
          type="text"
          placeholder="Search in conversation..."
          className="outline-none bg-gray-50 w-full p-2"
        />
      </div>
      <button
        className="w-full justify-center text-blue-500 border-solid text-sm border-gray-200 border-b-[1px] font-semibold uppercase p-3"
        onClick={() => setopnenDialog(true)}
      >
        Start a new conversation
      </button>

      {conversationSnapshot?.docs.map((conversation) => (
        <ConversationSelectted
          id={conversation.id}
          key={conversation.id}
          conversationUser={(conversation.data() as Conversation).users}
        />
      ))}

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Please enter a Google email address for the user you wish to chat
            with
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(event) => {
              setRecipientEmail(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={createConversation} disabled={!recipientEmail}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
