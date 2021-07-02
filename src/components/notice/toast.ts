import { Notify } from "quasar";

export type ToastType = "success" | "info" | "warning" | "error";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center";

export function toast(
  message: string,
  type: ToastType = "success",
  position: ToastPosition = "center"
): Function {
  let color = "positive";
  let duration = 2000;

  switch (type) {
    case "error":
      color = "negative";
      position = "top";
      break;
    case "warning":
      color = "warning";
      position = "top";
      break;
    case "info":
      color = "grey";
      duration = 1500;
      break;
    default:
      duration = 1500;
      break;
  }

  return Notify.create({
    message: message,
    timeout: duration,
    textColor: "white",
    color: color,
    position: position
  });
}
