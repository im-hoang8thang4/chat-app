import { User } from "firebase/auth";
import { Conversation } from "../interface";

export const getRecipientEmail = (conversationUsers : Conversation['users'],loggedInUser: User | null | undefined) =>{
 const recipientEmail = conversationUsers.find(conversationUser => conversationUser !== loggedInUser?.email )
 return recipientEmail
}