/** Root State */
export interface RootState {
  isLoading: boolean;
  currentUser: User;
  errors: String;
}

export type User = {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  image: string;
  isAuthed: boolean;
  admin: boolean;
}

export type SetCurrentUser = Pick<
  User,
  "id" | "name" | "username" | "password" | "email" | "image" | "isAuthed" | "admin"
>;
export type ToggleLoading = {
  isLoading: boolean
};

export type SetAuth = {
  name: string;
  username: string;
  email: string;
  password: string;
  code?: string[];
  changeScreen: any;
  showErrors: any;
};

export type ListProducts = {
  limit: number;
  offset: number;
  author?: User;
}

export type Product = {
  slug?: string;
  title: string;
  description: string;
  price: number
  image: string;
  author: User;
};

export type Comment = {
  id: number;
  message: string;
  commentAuthor: User,
  commentProduct: Product;
}

export const initialRootState: RootState = {
  isLoading: false,
  currentUser: {
    id: 0,
    name: "",
    username: "",
    password: "",
    email: "",
    image: "",
    isAuthed: false,
    admin: false
  },
  errors: "",
};
