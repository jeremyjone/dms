/**
 * 在这里编辑支持的扩展名，对应显示不同的图标文件。
 *
 * 扩展名与图标名称对应即可
 */

const FILE_TYPE = [
  "7z",
  "cab",
  "csv",
  "doc",
  "docx",
  "gif",
  "gzip",
  "jpeg",
  "jpg",
  "md",
  "mov",
  "mp3",
  "mp4",
  "pdf",
  "png",
  "ppt",
  "pptm",
  "pptx",
  "psd",
  "rar",
  "txt",
  "xls",
  "xlsx",
  "zip"
];

export function GetFileType(type: string) {
  if (["folder"].includes(type)) return "folder";

  return FILE_TYPE.includes(type) ? type : "file";
}
