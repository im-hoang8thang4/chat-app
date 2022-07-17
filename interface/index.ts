import { Timestamp } from "firebase/firestore"

export interface Conversation {
    users: string[]
}

export interface AppUser {
    email: string
    lastSeen: Timestamp
    avatarURL: string
}

export interface Imessage {
    id: string
    conversationid: string
    sent_at: string
    text: string
    user: string
}