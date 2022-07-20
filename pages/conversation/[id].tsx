import { doc, getDoc, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import MessagesScreen from "../../components/MessagesScreen";

import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";
import { auth, db } from "../../config/firebase";
import { Conversation, Imessage } from "../../interface";
import { generateQuerryGetMessage, transformMesage } from "../../utils/getMessagesInConversation";
import { getRecipientEmail } from "../../utils/getRecipientEmail";
export interface Props {
  conversation: Conversation;
  messages: Imessage[]
}
const Conversation = ({ conversation, messages }: Props) => {
  const [isLoading, setisLoading] = useState(false)
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(conversation.users, loggedInUser);
  useEffect(()=>{
    if(!conversation || !loggedInUser) setisLoading(true)
  })
  
  return isLoading ? <Spinner /> : (
    <div className="flex">
      <Head>
        <title>{`Conversation with ${recipientEmail}`}</title>
      </Head>
	  <Sidebar />
      <MessagesScreen conversation={conversation} messages={messages} />
    </div>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  const conversationId = context.params?.id;
  const conversationRef = doc(db, "conversations", conversationId as string);
  const conversationSnapshot = await getDoc(conversationRef);
  const querryMessages = generateQuerryGetMessage(conversationId)
  const mesagesSnapshot = await getDocs(querryMessages)
  const messages = mesagesSnapshot.docs.map(messageDoc => transformMesage(messageDoc))
  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages
    },
  };
};
