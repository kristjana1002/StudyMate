import { createContext } from 'react';

interface User {
  name: string;
  email: string;
}

export const UserContext = createContext<User | null>(null);
