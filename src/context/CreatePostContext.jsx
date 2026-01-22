import React, { createContext, useContext, useState } from 'react';

const CreatePostContext = createContext();

export const useCreatePost = () => {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error('useCreatePost must be used within a CreatePostProvider');
  }
  return context;
};

export const CreatePostProvider = ({ children }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  return (
    <CreatePostContext.Provider
      value={{
        isCreatePostOpen,
        openCreatePost,
        closeCreatePost,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};
