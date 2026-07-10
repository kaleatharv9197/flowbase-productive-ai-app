import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Read the public API key from environment variables
const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || "";

export const liveblocksClient = createClient({
  publicApiKey: publicApiKey || "pk_dev_placeholder_key_for_compilation"
});

// Setup room typing interfaces
export interface Presence {
  [key: string]: any;
  activeTaskId: string | null;
  isTypingTaskId: string | null;
}

export interface Storage {
  [key: string]: any;
}

export interface UserMeta {
  id: string;
  info: {
    name: string;
    avatar: string;
    color: string;
  };
}

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useSelf,
  useThreads
} = createRoomContext<Presence, Storage, UserMeta>(liveblocksClient);
