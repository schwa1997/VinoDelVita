/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Result, Select } from 'antd';

import { useNavigate } from 'react-router-dom';

import { SmileFilled } from '@ant-design/icons';

import { getAreaByID, getAreas, postReport } from '@/server/api/apis';

const { TextArea } = Input;

const Report: React.FC = () => {
    const navigate = useNavigate();
    const [visibility, setVisibility] = useState(false);
    const [currentLatitude, setCurrentLatitude] = useState();
    const [currentLongitude, setCurrentLongitude] = useState();
    const [locationAuto, setLocationAuto] = useState(true);
    const [area, setArea] = useState();
    const [currentArea, setCurrentArea] = useState('');
    const [currentVineyard, setCurrentVineyard] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [vineyards, setVineyards] = useState();
    const handleToggle = () => {
        const updatedState = !visibility;
        setVisibility(updatedState); // Call the parent's callback function with the updated state
    };
    const handleSubmit = async (value: {
        title: string;
        disease: string;
        description: string;
        vineyard: string;
        area: string;
    }) => {
        try {
            const { title, disease, description, vineyard, area } = value;
            if (!title || !disease || !description || !vineyard || !area) {
                throw new Error('Please fill out all required fields.');
            }
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const status = 1;
            // Make the API request
            await postReport(
                title,
                disease,
                description,
                longitude.toString(),
                latitude.toString(),
                vineyard,
                area,
                status,
            );
            setSubmitSuccess(true);
            setVisibility(false);
        } catch (error) {
            console.error('Failed to submit report:', error);
        }
    };

    useEffect(() => {
        if (locationAuto) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLatitude(latitude);
                setCurrentLongitude(longitude);
            });
        }
    }, []);

    useEffect(() => {
        getAreas().then((res) => {
            setArea(res);
        });
    }, []);

    const hnadleSelectArea = (value: string) => {
        setCurrentArea(value);
        getAreaByID(value).then((res) => {
            setVineyards(res.vineyards);
        });
    };
    const handleClearButton = () => {
        setLocationAuto(false);
    };
    const handleReadButton = () => {
        setLocationAuto(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLatitude(latitude);
                setCurrentLongitude(longitude);
            });
        }
    };

    return (
        <>
            {visibility ? (
                <>
                    <Button
                        id="button"
                        className="tw-z-50 tw-fixed tw-border tw-top-32 tw-right-2 tw-text-3xl tw-border-violet-300 tw-bg-violet-300 tw-text-white tw-rounded-md tw-h-max tw-transition tw-duration-500 tw-ease select-none tw-hover:bg-indigo-600  tw-focus:outline-none tw-focus:shadow-outline"
                        onClick={handleToggle}
                    >
                        Close the report
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        id="button"
                        className="tw-z-50 tw-fixed tw-border tw-top-32 tw-right-2 tw-text-3xl tw-border-violet-300 tw-bg-violet-300 tw-text-white tw-rounded-md tw-h-max tw-hover:bg-indigo-600 tw-focus:outline-none tw-focus:shadow-outline"
                        onClick={handleToggle}
                    >
                        Add a Report
                    </Button>
                </>
            )}
            {submitSuccess && (
                <Result
                    icon={<SmileFilled rev={undefined} style={{ color: 'purple' }} />}
                    className="tw-z-50 tw-fixed tw-left-1/4 tw-top-1/4 tw-rounded-lg tw-w-1/2 tw-bg-customPurple/80"
                    status="success"
                    title="Successfully Submited"
                    extra={[
                        <>
                            <Button>
                                <a target="_self" href="/users/listReports">
                                    List Reports
                                </a>
                            </Button>
                            <Button>
                                <a target="_self" href="/">
                                    Home Page
                                </a>
                            </Button>
                        </>,
                    ]}
                />
            )}
            ;
            <div
                id="Report"
                className="tw-z-40 tw-rounded tw-container tw-font-bold tw-bg-violet-200 hover:tw-bg-violet-200/80/60 tw-mt-32 tw-max-w-fit  tw-fixed tw-left-6 tw-top-0 tw-h-4/5 tw-overflow-y-auto"
            >
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    style={{
                        maxWidth: 1000,
                        padding: 20,
                        display: visibility ? 'block' : 'none',
                    }}
                    onFinish={handleSubmit}
                >
                    <Form.Item label="Operation">
                        <Button onClick={handleClearButton}>Clear Location</Button>
                        <Button onClick={handleReadButton}>Read Location</Button>
                    </Form.Item>
                    <Form.Item key="title" name="title" label="Title">
                        <Input placeholder="Title" />
                    </Form.Item>
                    {locationAuto ? (
                        <>
                            <Form.Item
                                key="latitude"
                                name="latitude"
                                label="Latitude"
                                rules={[{ type: 'string', message: 'wrong type!' }]}
                            >
                                <Input value={currentLatitude} placeholder="currentLatitude" />{' '}
                            </Form.Item>
                            <Form.Item
                                key="longitude"
                                name="longitude"
                                label="Longitude"
                                rules={[{ type: 'string', message: 'wrong type!' }]}
                            >
                                <Input value={currentLongitude} placeholder="currentLongitude" />{' '}
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item
                                key="latitude"
                                name="latitude"
                                label="Latitude"
                                rules={[{ type: 'string', message: 'wrong type!' }]}
                            >
                                <Input
                                    value={currentLatitude}
                                    placeholder="currentLatitude"
                                    onChange={(value) => setCurrentLatitude(value)}
                                />
                            </Form.Item>
                            <Form.Item
                                key="longitude"
                                name="longitude"
                                label="Longitude"
                                rules={[{ type: 'string', message: 'wrong type!' }]}
                            >
                                <Input
                                    value={currentLongitude}
                                    placeholder="currentLongitude"
                                    onChange={(value) => setCurrentLongitude(value)}
                                />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        key="disease"
                        name="disease"
                        label="Select Disease"
                        rules={[
                            {
                                required: true,
                                message: 'Select something!',
                            },
                        ]}
                    >
                        <Select>
                            <Select.Option value="Type A">Type A</Select.Option>
                            <Select.Option value="Type B">Type B</Select.Option>
                            <Select.Option value="Type C">Type C</Select.Option>
                        </Select>
                    </Form.Item>

                    {area === undefined ? (
                        'undefied'
                    ) : (
                        <Form.Item
                            name="area"
                            label="area"
                            rules={[
                                {
                                    required: true,
                                    message: 'Select something!',
                                },
                            ]}
                        >
                            <Select
                                defaultActiveFirstOption
                                onChange={(value) => hnadleSelectArea(value)}
                            >
                                {area.map((item) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    {vineyards === undefined ? (
                        ''
                    ) : (
                        <Form.Item
                            name="vineyard"
                            label="Vineyard"
                            rules={[
                                {
                                    required: true,
                                    message: 'Select something!',
                                },
                            ]}
                        >
                            <Select
                                defaultActiveFirstOption
                                onChange={(value) => setCurrentVineyard(value)}
                            >
                                {vineyards.map((item) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item name="description" key="description" label="Description">
                        <TextArea rows={1} />
                    </Form.Item>
                    <Form.Item label="Submit">
                        <Button htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default () => <Report latitude={0} longitude={0} />;
