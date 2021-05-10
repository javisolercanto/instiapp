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

export type Category = {
  id: number;
  name: string;
}

export type Location = {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

export type Rental = {
  id: number,
  title: string;
  description: string;
  price: number
  user: User;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
};

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
  id: number,
  name: string;
  description: string;
  price: number
  image: string;
  user: User;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
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
