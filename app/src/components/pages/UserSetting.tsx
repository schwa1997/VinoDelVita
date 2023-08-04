import { useFormik } from 'formik';
import { useState, useEffect } from 'react'; // Import useState and useEffect

import { useNavigate } from 'react-router';

import { Button } from 'antd';

import { EditFilled, MailOutlined, PhoneFilled, UserOutlined } from '@ant-design/icons';

import { confirmPSW, getCompanyByID, updateCompany, updateCompanyPSW } from '@/server/api/apis';

import ResultContainer from './components/Result';

const UpdateForm = ({ user }) => {
    const navigate = useNavigate();
    const [submitSuccess, setSubmitSuccess] = useState(false);
    // Destructure the user prop
    const [submissionError, setSubmissionError] = useState(null); // State to handle submission errors
    const [visible, setVisible] = useState(true);
    const handleClose = () => {
        setVisible(false);
    };
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            id: user.id,
            companyName: user.companyName,
            email: user.email,
            phone: user.phone,
            password: user.password,
        },

        onSubmit: (values) => {
            updateCompany(user.id, values.companyName, values.email, values.phone, user.password)
                .then((res) => {
                    if (res) {
                        setSubmitSuccess(true);
                        localStorage.setItem('currentUser', values.companyName);
                        navigate('/users/info');
                    }
                })
                .catch((error) => {
                    setSubmissionError(error.message); // Handle submission error
                });
        },
    });

    return (
        <>
            {!submitSuccess && visible && (
                <>
                    <form
                        id="Container"
                        className="tw-z-50 tw-w-1/2 tw-fixed tw-left-1/4 md:tw-left-1/3 tw-top-1/4 tw-transform  tw-bg-gradient-to-b tw-from-violet-300 tw-via-purple-300 tw-to-violet-50 tw-rounded-lg tw-shadow-md tw-p-6 sm:tw-p-8"
                        onSubmit={formik.handleSubmit}
                    >
                        {submissionError && (
                            <p className="tw-text-red-600 tw-mb-4">{submissionError}</p>
                        )}
                        <button
                            className="tw-absolute tw-top-2 tw-right-2 tw-text-black tw-rounded-full tw-outline-none tw-shadow-md"
                            onClick={handleClose}
                        >
                            X
                        </button>

                        <div className="tw-mb-4">
                            <label htmlFor="companyName" className="tw-block tw-font-bold">
                                Company Name
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.companyName}
                                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
                            />
                        </div>
                        <div className="tw-mb-4">
                            <label htmlFor="email" className="tw-block tw-font-bold">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
                            />
                        </div>
                        <div className="tw-mb-4">
                            <label htmlFor="phone" className="tw-block tw-font-bold">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                onChange={formik.handleChange}
                                value={formik.values.phone}
                                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
                            />
                        </div>

                        <button
                            id="button"
                            type="submit"
                            className="tw-bg-customPurple tw-hover:bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-w-full sm:tw-w-auto"
                        >
                            Submit
                        </button>
                    </form>
                </>
            )}
            {submitSuccess && <ResultContainer />}
        </>
    );
};
const ChangePSWForm = ({ user }) => {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [visible, setVisible] = useState(true);
    const [confirmOK, setConfirmOK] = useState(false); // State to track confirmation success

    const handleClose = () => {
        setVisible(false);
    };

    const formik = useFormik({
        initialValues: {
            oldpassword: '',
            newpassword: '',
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (!confirmOK) {
                    // Confirm old password logic
                    const confirmResult = await confirmPSW(values.oldpassword);
                    if (confirmResult) {
                        setConfirmOK(true); // Set confirmOK to true after successful confirmation
                    }
                } else {
                    const updatePSW = await updateCompanyPSW(values.newpassword);
                    if (updatePSW) {
                        console.log('sucess');
                        setSubmitSuccess(true);
                    }
                }
            } catch (error) {
                setSubmissionError(error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            {!submitSuccess && visible && (
                <form
                    id="Container"
                    className="tw-z-50 tw-fixed tw-left-1/2 tw-top-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-bg-gradient-to-b tw-from-violet-300 tw-via-purple-300 tw-to-violet-50 tw-rounded-lg tw-shadow-md tw-p-6 sm:tw-p-8"
                    onSubmit={formik.handleSubmit}
                >
                    {submissionError && (
                        <p className="tw-text-red-600 tw-mb-4">{submissionError}</p>
                    )}
                    <button
                        className="tw-absolute tw-top-2 tw-right-2 tw-text-black tw-rounded-full tw-outline-none tw-shadow-md"
                        onClick={handleClose}
                    >
                        X
                    </button>
                    {confirmOK ? (
                        <div className="tw-mb-4">
                            <label htmlFor="newpassword" className="tw-block tw-font-bold">
                                New Password
                            </label>
                            <input
                                id="newpassword"
                                name="newpassword"
                                type="password" // Use 'password' type for security
                                autoComplete="new-password" // Add this attribute
                                onChange={formik.handleChange}
                                value={formik.values.newpassword}
                                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
                            />
                        </div>
                    ) : (
                        <div className="tw-mb-4">
                            <label htmlFor="oldpassword" className="tw-block tw-font-bold">
                                Old Password
                            </label>
                            <input
                                id="oldpassword"
                                name="oldpassword"
                                autoComplete="old-password" // Add this attribute
                                type="password" // Use 'password' type for security
                                onChange={formik.handleChange}
                                value={formik.values.oldpassword}
                                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
                            />
                        </div>
                    )}
                    <button
                        id="button"
                        type="submit"
                        className="tw-bg-customPurple tw-hover:bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-w-full sm:tw-w-auto"
                    >
                        {confirmOK ? 'Submit' : 'Confirm Old Password'}
                    </button>
                </form>
            )}
            {submitSuccess && <ResultContainer />}
        </>
    );
};

const CompanyInfo = () => {
    const id = localStorage.getItem('id');
    console.log(id);
    const [user, setUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const [changePWD, setChangePWD] = useState(false);
    const handleEdit = () => {
        setEdit(!edit);
    };
    const handleChangePWD = () => {
        setChangePWD(!changePWD);
    };
    useEffect(() => {
        console.log(id);
        getCompanyByID(id)
            .then((res) => {
                setUser(res);
                console.log('res', res);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            {user && (
                <div
                    id="Container"
                    className="tw-bg-gradient-to-b tw-from-violet-300 tw-via-purple-300 tw-to-violet-50 tw-w-full md:tw-w-1/4 tw-fixed tw-pt-44 tw-h-screen tw-shadow-md tw-p-4"
                >
                    <p className="tw-flex tw-border-solid tw-border-white tw-p-2 tw-items-center tw-text-lg tw-font-medium tw-mb-2 tw-w-full tw-text-ellipsis">
                        <UserOutlined className="tw-mr-2" />
                        {user.companyName}
                    </p>
                    <p className="tw-flex tw-border-solid tw-border-white tw-p-2 tw-items-center tw-text-lg tw-font-medium tw-mb-2">
                        <MailOutlined className="tw-mr-2" />
                        {user.email}
                    </p>
                    <p className="tw-flex tw-border-solid tw-border-white tw-p-2 tw-items-center tw-text-lg tw-font-medium">
                        <PhoneFilled className="tw-mr-2" />
                        {user.phone}
                    </p>
                    <p>
                        <Button id="button" onClick={handleEdit}>
                            <EditFilled rev={undefined} />
                            {!edit ? `Edit` : `Cancle Edit`}
                        </Button>
                    </p>
                    <Button id="button" onClick={handleChangePWD}>
                        Change Password
                    </Button>
                </div>
            )}
            {user && edit && <UpdateForm user={user} />}
            {user && changePWD && <ChangePSWForm user={user} />}
        </div>
    );
};

export default CompanyInfo;
