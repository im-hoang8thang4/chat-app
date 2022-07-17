import { collection, DocumentData, orderBy, query, QueryDocumentSnapshot, Timestamp, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Imessage } from "../interface";


export const generateQuerryGetMessage = (conversationId?: string)=> query(collection(db, "messages"), where("conversation_id", "==", conversationId), orderBy("sent_at","asc"))

export const transformMesage = (messageDoc :  QueryDocumentSnapshot<DocumentData>) =>(
    {
        id: messageDoc.id,
        ...messageDoc.data(),
        sent_at: messageDoc.data().sent_at ? convertFirestoreTimestampToString(messageDoc.data().sent_at) : null
    }   as Imessage
)
export const convertFirestoreTimestampToString = (timestamp: Timestamp) =>
	new Date(timestamp.toDate().getTime()).toLocaleString()