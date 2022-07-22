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
import {
  generateQuerryGetMessage,
  transformMesage,
} from "../../utils/getMessagesInConversation";
import { getRecipientEmail } from "../../utils/getRecipientEmail";
export interface Props {
  conversation: Conversation;
  messages: Imessage[];
}
const Conversation = (props: Props) => {
  const [isLoading, setisLoading] = useState(false);
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  useEffect(() => {
    (async () => {
      setisLoading(true);
     const tempc=  await props.conversation;
     const tempm= await props.messages;
      setisLoading(false);
    })();
  }, []);
  const recipientEmail = getRecipientEmail(
    props.conversation.users,
    loggedInUser
  ); 
    return (
    <div className="flex">
      <Head>
        <title>{`Conversation with ${recipientEmail}`}</title>
      </Head>
      <Sidebar />
      {isLoading && <Spinner />}
      {!isLoading && (
        <MessagesScreen
          conversation={props.conversation}
          messages={props.messages}
        />
      )}
    </div>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  return {
    props: (async function () {
      const conversationId = context.params?.id;
      const conversationRef = doc(
        db,
        "conversations",
        conversationId as string
      );
      const conversationSnapshot = await getDoc(conversationRef);
      const querryMessages = generateQuerryGetMessage(conversationId);
      const mesagesSnapshot = await getDocs(querryMessages);
      const messages = mesagesSnapshot.docs.map((messageDoc) =>
        transformMesage(messageDoc)
      );
      return {
        conversation: conversationSnapshot.data() as Conversation,
        messages,
      };
    })(),
  };
};
