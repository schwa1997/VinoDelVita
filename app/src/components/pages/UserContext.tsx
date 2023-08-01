// UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextProps {
    currentUser: string;
    setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<string>(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser || '';
    });

    useEffect(() => {
        localStorage.setItem('currentUser', currentUser);
    }, [currentUser]);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
