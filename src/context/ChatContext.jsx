import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [currentChatUser, setCurrentChatUser] = useState(null);
    const [currentChatId, setCurrentChatId] = useState(null);

   

    const setCurrentChat = (chatId, userData) => {
        setCurrentChatId(chatId);
        // Ensure userData includes the chatId for tracking
        setCurrentChatUser({ ...userData, chatId });
    };

    const clearCurrentChat = () => {
        setCurrentChatId(null);
        setCurrentChatUser(null);
    };

    const value = {
        currentChatUser,
        currentChatId,
        setCurrentChat,
        clearCurrentChat
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
