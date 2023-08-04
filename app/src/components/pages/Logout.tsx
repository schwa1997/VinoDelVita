import { useEffect, useState } from 'react';

import ResultContainer from './components/Result';

const LogOut = () => {
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        // Function to clear the data from localStorage
        const handleLogout = () => {
            localStorage.removeItem('role');
            localStorage.removeItem('id');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('currentUser');
        };
        setSubmitSuccess(true);
        handleLogout(); // Call the logout function
    }, []); // The empty dependency array ensures that the useEffect runs only once on component mount

    return (
        <>
            <div>{submitSuccess && <ResultContainer />}</div>
        </>
    );
};

export default LogOut;
