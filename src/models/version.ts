import { FileItem } from "./file";
import { UserItem } from "./user";

export interface VersionItem {
    version: string;
    comment: string;
    file: FileItem;
    creator: UserItem;
    createTime: string;
}
