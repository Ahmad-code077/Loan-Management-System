let users = [
  {
    id: 1,
    username: 'admin',
    email: '',
    first_name: '',
    last_name: '',
  },
  {
    id: 12,
    username: 'mahmadmamoon',
    email: 'mahmadmamoon@gmail.com',
    first_name: '',
    last_name: '',
  },
];

export const getUsers = () => users;

export const getUserById = (id) =>
  users.find((user) => user.id === parseInt(id));

export const addUser = (userData) => {
  const newId = Math.max(...users.map((u) => u.id)) + 1;
  const newUser = {
    id: newId,
    username: userData.username,
    email: userData.email || '',
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id, userData) => {
  const userIndex = users.findIndex((user) => user.id === parseInt(id));
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
    };
    return users[userIndex];
  }
  return null;
};

export const deleteUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === parseInt(id));
  if (userIndex !== -1) {
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    return deletedUser;
  }
  return null;
};
