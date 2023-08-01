import React, { useState, useEffect } from 'react';

import L from 'leaflet';
import { Button } from 'antd';

import 'leaflet/dist/leaflet.css';

const Map: React.FC = () => {
    const [visibility, setVisibility] = useState(false);
    const handleToggle = () => {
        const updatedState = !visibility;
        setVisibility(updatedState); // Call the parent's callback function with the updated state
    };
    useEffect(() => {
        let map: L.Map | null = null;
        let marker: L.Marker | null = null;
        if (!map) {
            map = L.map('map');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        map?.setView([latitude, longitude], 19);

                        // Create a custom DivIcon with a Unicode character as the content
                        const customIcon = L.divIcon({
                            className: 'custom-icon tw-border-solid tw-border-1px tw-text-xl',
                            html: '🚩',
                            iconSize: [20, 20], // Adjust the size of the icon as needed
                        });

                        // Create a marker and add it to the map
                        marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
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
        }

        return () => {
            if (map) {
                map.remove();
                map = null;
            }
            if (marker) {
                marker.remove();
                marker = null;
            }
        };
    }, []);

    return (
        <>
            {!visibility ? (
                <>
                    <Button
                        id="button"
                        className="tw-z-50 tw-border tw-fixed tw-bottom-0 tw-left-2 tw-border-indigo-500 tw-bg-indigo-500 tw-text-white tw-rounded-md tw-px-4 tw-pb-2 tw-m-2 tw-transition tw-duration-500 tw-ease select-none tw-hover:bg-indigo-600 tw-focus:outline-none tw-focus:shadow-outline"
                        onClick={handleToggle}
                    >
                        Hide Map
                    </Button>
                    <div
                        id="map"
                        className="tw-fixed tw-h-screen tw-w-screen tw-z-0 tw-top-28 tw-left-0"
                    />
                </>
            ) : (
                <>
                    <Button
                        id="button"
                        className="tw-z-50 tw-border tw-fixed tw-bottom-0 tw-left-2 tw-border-indigo-500 tw-bg-indigo-500 tw-text-white tw-rounded-md tw-px-4 tw-pb-2 tw-m-2 tw-transition tw-duration-500 tw-ease select-none tw-hover:bg-indigo-600 tw-focus:outline-none tw-focus:shadow-outline"
                        onClick={handleToggle}
                    >
                        👀
                    </Button>
                    <div
                        id="map"
                        className="tw-invisible tw-fixed tw-h-screen tw-w-screen tw-z-0 tw-top-28 tw-left-0"
                    />
                </>
            )}
        </>
    );
};

export default Map;
