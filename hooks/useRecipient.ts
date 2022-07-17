import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/firebase";
import { AppUser, Conversation } from "../interface";
import { getRecipientEmail } from "../utils/getRecipientEmail";

export const useRecipient = (conversationUser: Conversation['users']) =>{
    const [loggedInUser, _loading, _error] = useAuthState(auth)
    const recipientEmail = getRecipientEmail(conversationUser,loggedInUser)
    const querryGetRecipipent = query(collection(db,'users'), where('email', '==' , recipientEmail))

    const [recipientsSnapshot, __loading, __error] = useCollection(querryGetRecipipent)
    
    const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined

    return{
        recipient,
        recipientEmail
    }
}