import { useEffect, useState } from 'react';
import { Button, Result } from 'antd';

import Header, { Theme } from '../header';

import { useUserContext } from './UserContext';
import { SmileOutlined } from '@ant-design/icons';

const LogOut = () => {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { setCurrentUser } = useUserContext();
    useEffect(() => {
        // Function to clear the data from localStorage
        const handleLogout = () => {
            localStorage.removeItem('jwtToken'); // Replace 'jwtToken' with your actual token key
            localStorage.removeItem('currentUser'); // Replace 'currentUser' with your actual user data key
        };
        setSubmitSuccess(true);
        setCurrentUser('');
        handleLogout(); // Call the logout function
    }, []); // The empty dependency array ensures that the useEffect runs only once on component mount

    return (
        <>
            <div>
                <Theme>
                    <Header />
                    {submitSuccess && (
                        <Result
                            icon={<SmileOutlined rev={undefined} style={{ color: 'purple' }} />}
                            className="tw-z-50 tw-fixed tw-left-1/4 tw-top-1/4 tw-rounded-lg tw-w-1/2 tw-bg-customPurple/80"
                            status="success"
                            title="Successfully Log Out"
                            extra={[
                                <>
                                    <Button>
                                        <a target="_self" href="/">
                                            Return to Home
                                        </a>
                                    </Button>
                                    <Button>
                                        <a target="_self" href="/users/login">
                                            Log In Again
                                        </a>
                                    </Button>
                                </>,
                            ]}
                        />
                    )}
                </Theme>
            </div>
        </>
    );
};

export default LogOut;
