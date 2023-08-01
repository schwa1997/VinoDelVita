import L from 'leaflet';
import React, { useState, useEffect } from 'react';

import { Button, Form, Input, Result, Select } from 'antd';
import { SmileFilled } from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';

import {
    deleteVineyardByID,
    getAreaByID,
    getAreasByAdmin,
    getInterventionsAsAgronomists,
    getVineyardByID,
    updateVineyard,
} from '@/server/api/apis';

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
const MarksVineyardsAsAgronomist: React.FC = () => {
    const [areas, setAreas] = useState();
    const [intervention, setIntervention] = useState();
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
    const handleIntervention = (value: string) => {};
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
        const { id } = currentVineyard;
        const { name, winetype, areanumber, area, execution, interventions, yearofplanning } =
            values;
        const geoJsonPolygon = {
            type: 'Polygon',
            coordinates: geometry.coordinates,
        };
        console.log('geometry', geoJsonPolygon);
        console.log('values', values);
        try {
            const response = await updateVineyard(
                id,
                name,
                winetype,
                areanumber,
                yearofplanning,
                area,
                execution,
                interventions,
                geoJsonPolygon,
            );
            console.log('Response:', response);
            setSubmitSuccess(true);
        } catch (error) {
            console.error('Failed to submit area:', error);
        }
    };
    useEffect(() => {
        getAreasByAdmin().then((res) => {
            setAreas(res);
            console.log(res);
        });
    }, []);
    useEffect(() => {
        getInterventionsAsAgronomists().then((res) => {
            setIntervention(res);
            console.log(res);
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
                <div className="tw-container tw-pr-8 tw-rounded tw-w-fit tw-bg-customPurple/70 hover:tw-bg-customPurple tw-absolute tw-text-white tw-top-1/4 tw-left-4 tw-py-10 tw-px-2">
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
                            name="SelectArea"
                            label="Area:"
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
                                        <Option key={item.id} value={item.id}>
                                            {item.areanumber}-{item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}
                        {!edit ? (
                            <Form.Item name="Select Vineyard" label="Edit">
                                <Button onClick={handleEdit}>Edit</Button>
                            </Form.Item>
                        ) : (
                            ''
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
                                    name="interventions"
                                    label="Interventions"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select at least one intervention!',
                                            type: 'array',
                                        },
                                    ]}
                                >
                                    <Select
                                        onChange={(values) => handleIntervention(values)}
                                        mode="multiple" // Add mode prop with 'multiple' value for multiple selection
                                        placeholder="Select interventions"
                                    >
                                        {intervention.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.type}: {item.description}
                                            </Select.Option>
                                        ))}
                                    </Select>
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
                                    initialValue={currentVineyard.area.name}
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
                                <a target="_self" href="/aronomists/ListVineyards">
                                    See the Vineyards
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

export default MarksVineyardsAsAgronomist;
