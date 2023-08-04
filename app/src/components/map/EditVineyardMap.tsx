import L from 'leaflet';
import React, { useState, useEffect } from 'react';

import { Button, Form, Input, Select } from 'antd';
import 'leaflet/dist/leaflet.css';

import {
    deleteVineyardByID,
    getAreaByID,
    getAreas,
    getVineyardByID,
    updateVineyard,
} from '@/server/api/apis';

import GeneralInfo from '../pages/components/GeneralInfo';
import ResultContainer from '../pages/components/Result';

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
const EditVineyardMap: React.FC = () => {
    const [err, setErr] = useState(false);
    const [areas, setAreas] = useState<any>();
    const [edit, setEdit] = useState(false);
    const [currentVineyard, setCurrentVineyard] = useState<any>();
    const [currentArea, setCurrentArea] = useState<any>();
    const [geometry, setGeometry] = useState<any>([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const toggleFormVisibility = () => {
        setIsFormVisible((prevValue) => !prevValue);
    };
    const handleCoordinateChange = (index: number, subIndex: number, value: number) => {
        const updatedCoordinates = [...geometry.coordinates];
        updatedCoordinates[0][index][subIndex] = value;
        setGeometry({ ...geometry, coordinates: updatedCoordinates });
    };
    const handleDelete = () => {
        console.log(err);
        setErr(false);
        deleteVineyardByID(currentVineyard.id)
            .then(() => {
                setSubmitSuccess(true);
                setErr(false);
            })
            .catch((error) => {
                setErr(true);
                console.error('Error deleting:', error);
            });
    };
    const handleAreaOption = (value: string) => {
        getAreaByID(value)
            .then((area) => {
                setCurrentArea(area);
                setGeometry(area.geometry);
            })
            .catch((error) => {
                setErr(true);
                console.error('Error fetching area details:', error);
            });
    };
    const handleVineyardOption = (value: string) => {
        getVineyardByID(value)
            .then((vineyard) => {
                setCurrentVineyard(vineyard);
                setGeometry(vineyard.geometry);
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
        const { name, winetype, areanumber, area, execution, yearofplanning } = values;
        const interventions = currentVineyard.interventions.map((item) => item.id);
        try {
            const response = await updateVineyard(
                currentVineyard.id,
                name,
                winetype,
                areanumber,
                yearofplanning,
                area,
                execution,
                interventions,
                geometry,
            );
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
        let vineyardPolygon: L.Polygon | null = null;
        if (!map && geometry && geometry.coordinates && geometry.coordinates.length > 0) {
            map = L.map('map').setView(
                [geometry.coordinates[0][0][0], geometry.coordinates[0][0][1]],
                19,
            );

            areaPolygon = L.polygon(currentArea.geometry.coordinates[0], {
                color: 'purple',
                weight: 3,
                fillColor: 'pink',
                fillOpacity: 0.4,
            }).addTo(map!);
            if (currentVineyard) {
                vineyardPolygon = L.polygon(currentVineyard.geometry.coordinates[0], {
                    color: 'purple',
                    weight: 3,
                    fillColor: 'red',
                    fillOpacity: 0.4,
                }).addTo(map!);
            }
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
            if (vineyardPolygon) {
                vineyardPolygon.remove();
                vineyardPolygon = null;
            }
        };
    }, [geometry, currentArea, currentVineyard, edit]);

    return (
        <>
            {err && <GeneralInfo />}
            <Button
                id="button"
                className="tw-z-50 tw-border tw-fixed tw-bottom-0 tw-left-2  tw-bg-customPurple tw-text-purple-500 tw-rounded-md tw-px-4 tw-pb-2 tw-m-2 tw-transition tw-duration-500 tw-ease select-none tw-hover:bg-indigo-600 tw-focus:outline-none tw-focus:shadow-outline"
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
                            name="Select Area"
                            label="Area"
                            rules={[
                                {
                                    required: true,
                                    message: 'Select something!',
                                },
                            ]}
                        >
                            {areas && (
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
                        {currentArea && currentArea.vineyards && (
                            <>
                                <Form.Item
                                    name="Select Vineyard"
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
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.areanumber}-{item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                {currentVineyard && currentVineyard.interventions && (
                                    <Form.Item name="interventions" label="Interventions">
                                        <ul className="tw-list-disc tw-mt-2 tw-rounded tw-border-solid tw-border-white tw-text-white">
                                            {currentVineyard.interventions.map((item) => (
                                                <li
                                                    key={item.id}
                                                    value={item.id}
                                                    className="tw-mb-3"
                                                >
                                                    <span className="tw-font-semibold tw-mr-2">
                                                        {item.type}
                                                    </span>
                                                    <span>{item.description}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Form.Item>
                                )}
                            </>
                        )}
                        {!edit && (
                            <>
                                <Form.Item name="Select Vineyard" label="Edit">
                                    <Button onClick={handleEdit}>Edit</Button>
                                </Form.Item>
                                <Form.Item name="Select Vineyard" label="Delete">
                                    <Button onClick={handleDelete}>Delete</Button>
                                </Form.Item>
                            </>
                        )}
                        {edit && (
                            <>
                                <Form.Item
                                    key="name"
                                    name="name"
                                    label="Name"
                                    initialValue={currentVineyard.name}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the Vineyard Name',
                                        },
                                        {
                                            type: 'string',
                                            message: 'Please enter a valid string',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Vineyard Name" />
                                </Form.Item>
                                <Form.Item
                                    key="execution"
                                    name="execution"
                                    label="Execution"
                                    initialValue={currentVineyard.execution}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the execution',
                                        },
                                        {
                                            type: 'string',
                                            message: 'Please enter a valid string',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Vineyard Execution" />
                                </Form.Item>
                                <Form.Item
                                    key="winetype"
                                    name="winetype"
                                    label="Wine Type"
                                    initialValue={currentVineyard.winetype}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the Vineyard Name',
                                        },
                                        {
                                            type: 'string',
                                            message: 'Please enter a valid string',
                                        },
                                    ]}
                                >
                                    <Select defaultActiveFirstOption>
                                        <Select.Option value="Red Wine">Red Wine</Select.Option>
                                        <Select.Option value="White Wine">White Wine</Select.Option>
                                        <Select.Option value="Rosé Wine">Rosé Wine</Select.Option>
                                        <Select.Option value="Sparkling Wine">
                                            Sparkling Wine
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    key="areanumber"
                                    name="areanumber"
                                    label="Area Order"
                                    initialValue={currentVineyard.areanumber}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the Vineyard Name',
                                        },
                                        {
                                            type: 'string',
                                            message: 'Please enter a valid string',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Vineyard Area Order" />
                                </Form.Item>

                                <Form.Item
                                    key="area"
                                    name="area"
                                    label="Select Area"
                                    initialValue={currentVineyard.area}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the Vineyard Name',
                                        },
                                        {
                                            type: 'string',
                                            message: 'Please enter a valid string',
                                        },
                                    ]}
                                >
                                    {areas && (
                                        <Select defaultActiveFirstOption>
                                            {areas.map((item) => (
                                                <Select.Option key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item
                                    key="yearofplanning"
                                    name="yearofplanning"
                                    label="Year Of Planning"
                                    initialValue={currentVineyard.yearofplanning}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the Vineyard Name',
                                        },
                                        {
                                            type: 'string',
                                            message: 'Please enter a valid number',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Vineyard Year Of Planning" />
                                </Form.Item>

                                {geometry.coordinates[0].map((coordinatePair, index) => (
                                    <div key={index}>
                                        <Form.Item label={`Latitude ${index + 1}`}>
                                            <Input
                                                value={coordinatePair[0]}
                                                onChange={(e) =>
                                                    handleCoordinateChange(
                                                        index,
                                                        0,
                                                        parseFloat(e.target.value) || 0,
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                        <Form.Item label={`Longitude ${index + 1}`}>
                                            <Input
                                                value={coordinatePair[1]}
                                                onChange={(e) =>
                                                    handleCoordinateChange(
                                                        index,
                                                        1,
                                                        parseFloat(e.target.value) || 0,
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </div>
                                ))}
                                <Form.Item name="Select Vineyard" label="Submit">
                                    <Button htmlType="submit">Submit</Button>
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </div>
            )}

            {submitSuccess && <ResultContainer />}
        </>
    );
};

export default EditVineyardMap;
