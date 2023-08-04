/* eslint-disable react/no-array-index-key */
import L from 'leaflet';
import React, { useState, useEffect } from 'react';

import { Button, Form, Select } from 'antd';
import 'leaflet/dist/leaflet.css';

import {
    deleteVineyardByID,
    getAreaByID,
    getAreasByAdmin,
    getInterventionsAsAgronomists,
    getVineyardByID,
    updateVineyard,
} from '@/server/api/apis';

import { ReportCard } from '../components/ReportCard';
import ResultContainer from '../components/Result';

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
const ListVineyardsAsAgronomist: React.FC = () => {
    const [areas, setAreas] = useState<any>();
    const [intervention, setIntervention] = useState<any>();
    const [edit, setEdit] = useState(false);
    const [report, setReport] = useState(false);
    const [currentReport, setCurrentReport] = useState<any>();
    const [currentVineyard, setCurrentVineyard] = useState<any>();
    const [currentArea, setCurrentArea] = useState<any>();
    const [geometry, setGeometry] = useState<any>([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const toggleFormVisibility = () => {
        setIsFormVisible((prevValue) => !prevValue);
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
    const handleReportChange = (value: string) => {
        const { reports } = currentVineyard;
        console.log('reports', reports);
        setCurrentReport(reports.find((item: { id: string }) => item.id === value));
    };
    const handleVineyardOption = (value: string) => {
        getVineyardByID(value)
            .then((vineyard) => {
                setCurrentVineyard(vineyard);
                setCurrentReport(vineyard.reports);
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
    const handleReport = () => {
        setReport(true);
    };
    const handleSubmit = async (values: any) => {
        const { id } = currentVineyard;
        const { interventions } = values;
        try {
            const response = await updateVineyard(
                id,
                currentVineyard.name,
                currentVineyard.winetype,
                currentVineyard.areanumber,
                currentVineyard.yearofplanning,
                currentArea.id,
                currentVineyard.execution,
                interventions,
                currentVineyard.geometry,
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
                <div
                    id="form"
                    className="tw-container tw-pr-8 tw-rounded tw-w-fit tw-bg-customPurple/70 hover:tw-bg-customPurple tw-absolute tw-text-white tw-top-1/4 tw-left-4 tw-py-10 tw-px-2"
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
                                    {areas.map(
                                        (item: {
                                            id: React.Key | null | undefined;
                                            name:
                                                | string
                                                | number
                                                | boolean
                                                | React.ReactElement<
                                                      any,
                                                      string | React.JSXElementConstructor<any>
                                                  >
                                                | React.ReactFragment
                                                | React.ReactPortal
                                                | null
                                                | undefined;
                                        }) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ),
                                    )}
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
                                    {currentArea.vineyards.map(
                                        (item: {
                                            id: React.Key | null | undefined;
                                            areanumber:
                                                | string
                                                | number
                                                | boolean
                                                | React.ReactFragment
                                                | React.ReactPortal
                                                | React.ReactElement<
                                                      any,
                                                      string | React.JSXElementConstructor<any>
                                                  >
                                                | null
                                                | undefined;
                                            name:
                                                | string
                                                | number
                                                | boolean
                                                | React.ReactFragment
                                                | React.ReactPortal
                                                | React.ReactElement<
                                                      any,
                                                      string | React.JSXElementConstructor<any>
                                                  >
                                                | null
                                                | undefined;
                                        }) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.areanumber}-{item.name}
                                            </Select.Option>
                                        ),
                                    )}
                                </Select>
                            </Form.Item>
                        )}
                        {!report ? (
                            <Form.Item name="read report" label="Report">
                                <Button onClick={handleReport}>Read Report</Button>
                            </Form.Item>
                        ) : (
                            <>
                                <Form.Item
                                    key="Report"
                                    name="Report"
                                    label="Select Report"
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
                                    {currentVineyard && (
                                        <Select
                                            onChange={(value) => handleReportChange(value)}
                                            defaultActiveFirstOption
                                        >
                                            {currentVineyard.reports.map(
                                                (item: {
                                                    id: React.Key | null | undefined;
                                                    name:
                                                        | string
                                                        | number
                                                        | boolean
                                                        | React.ReactElement<
                                                              any,
                                                              | string
                                                              | React.JSXElementConstructor<any>
                                                          >
                                                        | React.ReactFragment
                                                        | React.ReactPortal
                                                        | null
                                                        | undefined;
                                                }) => (
                                                    <Select.Option key={item.id} value={item.id}>
                                                        {item.title}
                                                    </Select.Option>
                                                ),
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                                <div className="tw-fixed tw-right-2 tw-top-32 tw-w-fit">
                                    <ReportCard
                                        id={currentReport.id}
                                        title={currentReport.title}
                                        description={currentReport.description}
                                        disease={currentReport.disease}
                                        area={currentArea.name}
                                        vineyard={currentVineyard.name}
                                    />
                                </div>
                            </>
                        )}
                        {!edit ? (
                            <Form.Item name="Select Vineyard" label="Edit">
                                <Button onClick={handleEdit}>Add intervnetion</Button>
                            </Form.Item>
                        ) : (
                            ''
                        )}

                        {edit && (
                            <>
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
                                        {intervention.map(
                                            (item: {
                                                id: React.Key | null | undefined;
                                                type:
                                                    | string
                                                    | number
                                                    | boolean
                                                    | React.ReactElement<
                                                          any,
                                                          string | React.JSXElementConstructor<any>
                                                      >
                                                    | React.ReactFragment
                                                    | React.ReactPortal
                                                    | null
                                                    | undefined;
                                                description:
                                                    | string
                                                    | number
                                                    | boolean
                                                    | React.ReactElement<
                                                          any,
                                                          string | React.JSXElementConstructor<any>
                                                      >
                                                    | React.ReactFragment
                                                    | React.ReactPortal
                                                    | null
                                                    | undefined;
                                            }) => (
                                                <Select.Option key={item.id} value={item.id}>
                                                    {item.type}: {item.description}
                                                </Select.Option>
                                            ),
                                        )}
                                    </Select>
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

            {submitSuccess && <ResultContainer />}
        </>
    );
};

export default ListVineyardsAsAgronomist;
