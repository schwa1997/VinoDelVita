import L from 'leaflet';
import React, { useState, useEffect } from 'react';

import { Button, Form, Input, Result, Select } from 'antd';
import { SmileFilled } from '@ant-design/icons';

import {
    deleteVineyardByID,
    getAreaByID,
    getAreas,
    getVineyardByID,
    postReport,
} from '@/server/api/apis';

import 'leaflet/dist/leaflet.css';
import TextArea from 'antd/es/input/TextArea';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 8,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 16,
        },
        sm: {
            span: 16,
        },
    },
};
const ReportMap: React.FC = () => {
    const [areas, setAreas] = useState();
    const [edit, setEdit] = useState(false);
    const [currentVineyard, setCurrentVineyard] = useState();
    const [currentArea, setCurrentArea] = useState();
    const [geometry, setGeometry] = useState<number[][]>([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const toggleFormVisibility = () => {
        setIsFormVisible((prevValue) => !prevValue);
    };
    const handleCoordinateChange = (index: number, subIndex: number, value: number) => {
        console.log('handleCoordinateChange');
        const updatedCoordinates = [...geometry.coordinates];
        updatedCoordinates[0][index][subIndex] = value;
        setGeometry({ ...geometry, coordinates: updatedCoordinates });
        console.log(geometry);
    };
    const handleDelete = () => {
        deleteVineyardByID(currentVineyard.id)
            .then((res) => {
                console.log('current vineyard', res);
                setSubmitSuccess(true);
            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch
                console.error('Error deleting:', error);
            });
    };
    const handleAreaOption = (value: string) => {
        getAreaByID(value)
            .then((area) => {
                setCurrentArea(area);
                setGeometry(area.geometry);
                console.log('currentArea', area);
            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch
                console.error('Error fetching area details:', error);
            });
    };
    const handleVineyardOption = (value: string) => {
        getVineyardByID(value)
            .then((vineyard) => {
                setCurrentVineyard(vineyard);
                setGeometry(vineyard.geometry);
                console.log('current vineyard', vineyard);
            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch
                console.error('Error fetching area details:', error);
            });
    };
    const handleEdit = () => {
        setEdit(true);
    };
    const handleSubmit = async (values: any) => {
        const { title, disease, description, area, vineyard, status } = values;

        console.log(values);
        try {
            const response = await postReport(title, disease, description, area, vineyard, status);
            console.log('Response:', response);
            setSubmitSuccess(true);
        } catch (error) {
            console.error('Failed to submit area:', error);
        }
    };
    useEffect(() => {
        getAreas().then((res) => {
            setAreas(res);
        });
    }, []);

    useEffect(() => {
        let map: L.Map | null = null;
        let areaPolygon: L.Polygon | null = null;
        console.log('geometry', geometry);
        if (!map && geometry.coordinates && geometry.coordinates.length > 0) {
            console.log(
                'geometry',
                geometry,
                geometry.coordinates[0][0][1],
                geometry.coordinates[0][0][0],
            );
            map = L.map('map').setView(
                [geometry.coordinates[0][0][0], geometry.coordinates[0][0][1]],
                19,
            );

            areaPolygon = L.polygon(geometry.coordinates[0], {
                color: 'purple',
                weight: 3,
                fillColor: 'pink',
                fillOpacity: 0.4,
            }).addTo(map!);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            // Add click event listener to the map
        }

        return () => {
            if (map) {
                map.remove();
                map = null;
            }

            if (areaPolygon) {
                areaPolygon.remove();
                areaPolygon = null;
            }
        };
    }, [geometry, currentArea, edit]);

    return (
        <>
            <Button
                id="button"
                className="tw-z-50 tw-border tw-fixed tw-bottom-0 tw-left-2 tw-border-indigo-500 tw-bg-customPurple tw-text-purple-500 tw-rounded-md tw-px-4 tw-pb-2 tw-m-2 tw-transition tw-duration-500 tw-ease select-none tw-hover:bg-indigo-600 tw-focus:outline-none tw-focus:shadow-outline"
                onClick={toggleFormVisibility}
            >
                {isFormVisible ? 'Hide Form' : 'Show Form'}
            </Button>
            <div id="map" className="tw-fixed tw-h-screen tw-w-screen tw-z-0 tw-top-28 tw-left-0" />

            {!submitSuccess && isFormVisible && (
                <div
                    id="form"
                    className="tw-container tw-rounded-xl tw-w-1/3 tw-bg-customPurple/70 hover:tw-bg-customPurple tw-absolute tw-text-white tw-top-32 tw-left-4 tw-pt-10 tw-pl-2 tw-pr-6"
                >
                    {' '}
                    <Form
                        {...formItemLayout}
                        name="vineyard infomation"
                        style={{
                            maxWidth: 600,
                        }}
                        scrollToFirstError
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="area"
                            label="Select Area"
                            rules={[
                                {
                                    required: true,
                                    message: 'Select something!',
                                },
                            ]}
                        >
                            {areas === undefined ? (
                                'undefied'
                            ) : (
                                <Select
                                    onChange={(value) => handleAreaOption(value)}
                                    defaultActiveFirstOption
                                >
                                    {areas.map((item) => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                        {currentArea === undefined ? (
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
                                    onChange={(value) => handleVineyardOption(value)}
                                    defaultActiveFirstOption
                                >
                                    {currentArea.vineyards.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.areanumber}-{item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}
                        {!edit ? (
                            <Form.Item name="Select Vineyard" label="Edit the info">
                                <Button onClick={handleEdit}>Edit</Button>
                            </Form.Item>
                        ) : (
                            ''
                        )}
                        {edit && (
                            <>
                                <Form.Item key="title" name="title" label="Title">
                                    <Input placeholder="Title" />
                                </Form.Item>
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
                                <Form.Item
                                    key="status"
                                    name="status"
                                    label="Select Disease"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select something!',
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Select.Option value={1}>Type A</Select.Option>
                                        <Select.Option value={2}>Type B</Select.Option>
                                        <Select.Option value={3}>Type C</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="description" key="description" label="Description">
                                    <TextArea rows={1} />
                                </Form.Item>
                            </>
                        )}
                        {edit ? (
                            <Form.Item name="Select Vineyard" label="Submit">
                                <Button htmlType="submit">Submit</Button>
                            </Form.Item>
                        ) : (
                            ''
                        )}

                        <Form.Item name="Select Vineyard" label="Delete">
                            <Button onClick={handleDelete}>Delete</Button>
                        </Form.Item>
                    </Form>
                </div>
            )}

            {submitSuccess && (
                <Result
                    icon={<SmileFilled rev={undefined} style={{ color: 'purple' }} />}
                    className="tw-z-50 tw-fixed tw-left-1/4 tw-top-1/4 tw-w-1/2 tw-bg-customPurple/80"
                    status="success"
                    title="Successfully Submited"
                    extra={[
                        <>
                            <Button>
                                <a target="_self" href="/users/listReports">
                                    See the Reports
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
        </>
    );
};

export default ReportMap;
