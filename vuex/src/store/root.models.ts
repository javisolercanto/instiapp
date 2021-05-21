/** Root State */
export interface RootState {
  currentUser: User;
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

export type Rental = {
  id: number,
  title: string;
  description: string;
  price: number;
  user: User;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
};

export type Route = {
  id: number,
  title: string;
  description: string;
  price: number;
  seats: number;
  user: User;
  date: Date;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
};

export type Group = {
  id: number,
  name: string;
  description: string;
  price: number;
  days: string;
  user: User;
  belongs: User[];
  location: Location;
  createdAt: Date;
  updatedAt: Date;
};

export type SetCurrentUser = Pick<
  User,
  "id" | "name" | "username" | "password" | "email" | "image" | "isAuthed" | "admin"
>;

export type SetAuth = {
  name: string;
  username: string;
  email: string;
  password: string;
  code?: string[];
  changeScreen: any;
  showErrors: any;
};

export const initialRootState: RootState = {
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
};
