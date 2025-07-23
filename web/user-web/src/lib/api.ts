export interface User {
  id?: number;
  name: string;
  email: string;
  age: number;
}

// Replace this with your actual API base URL
const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8081'; // Change this to your backend URL

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};