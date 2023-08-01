import L from 'leaflet';
import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Button, Form, Input, Result } from 'antd';

import { SmileFilled } from '@ant-design/icons';

import { createArea } from '@/server/api/apis';

const AreaMap: React.FC = () => {
    const [geometry, setGeometry] = useState<number[][]>([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const toggleFormVisibility = () => {
        setIsFormVisible((prevValue) => !prevValue);
    };
    const handleSubmit = async (values: any) => {
        const { name, code } = values;
        const geoJsonPolygon = {
            type: 'Polygon',
            coordinates: [geometry],
        };
        const data = {
            name,
            code,
            geometry: geoJsonPolygon,
        };
        if (!values.name || !values.code) {
            console.error('Missing required fields in data:', values);
            return;
        }

        try {
            const response = await createArea(name, code, data.geometry);
            console.log('Response:', response);
            setSubmitSuccess(true);
        } catch (error) {
            console.error('Failed to submit area:', error);
        }
    };

    useEffect(() => {
        let map: L.Map | null = null;
        let areaPolygon: L.Polygon | null = null;

        if (!map) {
            map = L.map('map');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        map?.setView([latitude, longitude], 19);

                        areaPolygon = L.polygon(geometry, {
                            color: 'purple',
                            weight: 3,
                            fillColor: 'pink',
                            fillOpacity: 0.4,
                        }).addTo(map!);
                        areaPolygon.bindPopup('New Area').openPopup();
                    },
                    (error) => {
                        console.error('Error getting current position:', error);
                    },
                );
            }

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            // Add click event listener to the map
            map.on('click', (event: L.LeafletMouseEvent) => {
                const { lat, lng } = event.latlng;
                setGeometry((prevGeometry) => [...prevGeometry, [lat, lng]]);
            });
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
    }, [geometry]);

    return (
        <>
            <Button
                id="button"
                className="tw-z-50 tw-fixed tw-bottom-0 tw-left-2 tw-bg-customPurple/60 tw-text-purple-500 tw-rounded-md tw-px-4 tw-pb-2 tw-m-2 hover:tw-bg-customPurple"
                onClick={toggleFormVisibility}
            >
                {isFormVisible ? 'Hide Form' : 'Show Form'}
            </Button>
            <div id="map" className="tw-fixed tw-h-screen tw-w-screen tw-z-0 tw-top-28 tw-left-0" />

            {!submitSuccess && isFormVisible && (
                <div
                    id="form"
                    className="tw-container tw-bg-customPurple/70 tw-rounded-xl hover:tw-bg-customPurple tw-w-1/3 tw-left-2 tw-fixed tw-text-white tw-top-1/4 tw-py-10 tw-px-4"
                >
                    <Form onFinish={handleSubmit}>
                        <Form.Item
                            key="name"
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter name',
                                },
                                {
                                    type: 'string',
                                    message: 'Please enter a valid string',
                                },
                            ]}
                        >
                            <Input placeholder="Area Name" />
                        </Form.Item>
                        <Form.Item
                            key="code"
                            name="code"
                            label="Code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter code',
                                },
                                {
                                    type: 'string',
                                    message: 'Please enter a valid string',
                                },
                            ]}
                        >
                            <Input placeholder="Area Code" />
                        </Form.Item>
                        <Form.Item label="Submit">
                            <Button key="submit" htmlType="submit">
                                Submit
                            </Button>
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
                                <a target="_self" href="/users/new">
                                    Add another new Item
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

export default AreaMap;
