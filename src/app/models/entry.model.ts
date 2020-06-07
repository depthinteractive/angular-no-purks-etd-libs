export interface Entry {
  children?: Entry[];
  isLeaf?: boolean;
  key?: string;
  title?: string;
  value?: any;
  prop?: {
    [key: string]: any
  };

  [key: string]: any;
}

export interface TypedEntry<T> {
  [key: string]: T;
}

