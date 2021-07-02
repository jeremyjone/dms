import { UserItem } from "./user";

export interface LibraryItem {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  creatorId: number;
  creator: UserItem;
}

export interface LibraryAddItem {
  name: string;
  thumbnail: string;
  description: string;
  creatorId: number;
}

export interface LibraryUpdateItem {
  name: string;
  thumbnail: string;
  description: string;
}
