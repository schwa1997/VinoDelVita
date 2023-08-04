import { useEffect, useState } from 'react';

const ErrorInfo = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000); // Error message will be hidden after 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <>
            {visible && (
                <div className="tw-z-50 tw-bg-gradient-to-r tw-from-violet-300 tw-via-purple-300 tw-to-violet-50 tw-fixed tw-top-1/3 tw-left-1/4 tw-w-1/2 tw-text-center tw-p-12 tw-rounded-lg">
                    <button
                        className="tw-absolute tw-top-2 tw-right-2 tw-text-black tw-rounded-full tw-outline-none tw-shadow-md"
                        onClick={handleClose}
                    >
                        X
                    </button>
                    <h1>Error Login</h1>
                    <p>Check your password!</p>
                </div>
            )}
        </>
    );
};

export default ErrorInfo;
