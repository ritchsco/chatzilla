import { fb } from 'service';
import { useEffect, useState } from 'react';


// connect to FB and change the state depending if user logged in or not
export const useAuth = () => {
    const [authUser, setAuthUser] = useState(); // undefined || fb.User || null

    // end this stream when hook is mounted or called again
    // helps avoid memory leaks
    useEffect(() => {
        const unsubscribe = fb.auth.onAuthStateChanged(user => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });
        return unsubscribe;
    },[]); //only runs code on mount (empty array)

    return {
        authUser,
    };
};