/** Root State */
export interface RootState {
  isLoading: boolean;
  currentUser: User;
  errors: String;
}

export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  image: string;
  bio: string;
  karma?: number;
  isAuthed: boolean;
  isAdmin: boolean;
}

export type SetCurrentUser = Pick<
  User,
  "id" | "username" | "password" | "email" | "bio" | "image" | "isAuthed"
>;
export type ToggleLoading = {
  isLoading: boolean
};

export type SetAuth = {
  username: string;
  email: string;
  password: string;
  isLogin: boolean;
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
    username: "",
    password: "",
    email: "",
    image: "",
    bio: "",
    karma: 0,
    isAuthed: false,
    isAdmin: false
  },
  errors: "",
};
