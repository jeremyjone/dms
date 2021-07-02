export enum Status {
  OK = 1,
  Param = 2,
  Pepeat = 3,
  Error = 4,
  Empty = 5,
  Illegal = 6
}

export interface Response<T> {
  status: Status;
  data: T;
  errorCode: string;
}

export type TO<T = any> = Promise<[any, T | undefined]>;

export type ThemeId =
  | "jeremyjone"
  | "black"
  | "purple"
  | "red"
  | "yellow"
  | "blue"
  | "green"
  | "pink";
export interface ThemeOption {
  color: string;
  name: string;
  id: ThemeId;
  secondary: string;
  accent: string;
  positive?: string;
  negative?: string;
  info?: string;
  warning?: string;
}

export interface SideMenuItem {
  id: string;
  name: string;
  url?: string;
  children?: SideMenuItem[];
}

export interface CustomVueComponent extends Vue {
  show: () => void;
  hide: () => void;
  focus: () => void;
  shake: () => void;
  resetValidation: () => void;
}

export interface QuasarTreeNode<T> extends Vue {
  getNodeByKey: (key: any) => T;
  isExpanded: (key: any) => boolean;
  setExpanded: (key: any, expand: boolean) => void;
}

export interface LoadNodeParam<T> {
  node: T;
  key: string;
  done: Function;
  fail: Function;
}

export interface Uploader extends CustomVueComponent {
  add: (files: File[]) => void;
  upload: () => void;
  reset: () => void;
}

export type TableColumnAlign = "left" | "center" | "right";

export interface TableColumn {
  name: string;
  label: string;
  field: string | Function;
  required?: boolean;
  align?: TableColumnAlign;
  format?: (val: any, row: Object) => any;
  style?: string;
  classes?: string;
  headerStyle?: string;
  headerClasses?: string;
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: Object, rowB: Object) => Number;
}
