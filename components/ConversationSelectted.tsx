import { useRouter } from "next/router";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation } from "../interface";
import RecipientAvatar from "./RecipientAvatar";
import Spinner from "./Spinner";

const ConversationSelectted = ({
  id,
  conversationUser,
}: {
  id: string;
  conversationUser: Conversation["users"];
}) => {
  const { recipientEmail, recipient } = useRecipient(conversationUser);
  const router = useRouter()
  const onSelectedConvesation = () =>{
    router.push(`/conversation/${id}`)
  }
  return (
    <div className="flex items-center p-2 gap-2  hover:bg-gray-300 cursor-pointer break-all"
    onClick={onSelectedConvesation}
    >
      <RecipientAvatar recipientEmail={recipientEmail} recipient={recipient} />
      <span>{recipientEmail}</span>
    </div>
  );
};

export default ConversationSelectted;
