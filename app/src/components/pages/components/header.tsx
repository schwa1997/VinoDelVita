import React, { FC, useContext } from 'react';

import { isNil } from 'lodash';

import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

import {
    DownOutlined,
    EditOutlined,
    LoginOutlined,
    LogoutOutlined,
    PlusSquareOutlined,
    SettingOutlined,
    UnorderedListOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons';

import { ThemeConfig, ThemeContext } from './Theme';

const items: MenuProps['items'] = [
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/newReport">
                <PlusSquareOutlined rev={undefined} /> Add a report on map
            </a>
        ),
        key: '0',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/new">
                <PlusSquareOutlined rev={undefined} /> Add New Item
            </a>
        ),
        key: '1',
    },
    {
        type: 'divider',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/role/edit/vineyard">
                <EditOutlined rev={undefined} /> Edit Vineyard
            </a>
        ),
        key: '2',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/role/edit/area">
                <EditOutlined rev={undefined} /> Edit Area
            </a>
        ),
        key: '3',
    },

    {
        type: 'divider',
    },

    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/areas">
                <UnorderedListOutlined rev={undefined} /> List Areas
            </a>
        ),
        key: '4',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/role/list/vineyard">
                <UnorderedListOutlined rev={undefined} /> List Vineyards
            </a>
        ),
        key: '5',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/listReports">
                <UnorderedListOutlined rev={undefined} /> List Reports
            </a>
        ),
        key: '6',
    },

    {
        type: 'divider',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/login">
                <LoginOutlined rev={undefined} /> Log In
            </a>
        ),
        key: '7',
    },

    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/logout">
                <LogoutOutlined rev={undefined} /> Log Out
            </a>
        ),
        key: '8',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/signup">
                <UserAddOutlined rev={undefined} /> Sign Up
            </a>
        ),
        key: '9',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/info">
                <SettingOutlined rev={undefined} /> User Setting
            </a>
        ),
        key: '10',
    },
];

const Header: FC = () => {
    const currentUser = localStorage.getItem('currentUser');
    const context = useContext(ThemeContext);
    if (isNil(context)) return null;
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Handle the link click event here if needed
    };
    return (
        <div
            id="Container"
            className="tw-w-full tw-bg-gradient-to-r tw-from-violet-300 tw-via-purple-300 tw-to-violet-50 tw-z-50 tw-fixed tw-right-0 tw-top-0 tw-backdrop-blur-sm tw-shadow-md tw-py-5 tw-px-8"
        >
            <div className="tw-grid md:tw-grid-cols-2 tw-gap-5">
                <div className="md:tw-ml-10 md:tw-mt-3 md:tw-justify-start">
                    <h1 className="tw-font-bold tw-text-4xl tw-text-white">
                        <a
                            target="_self"
                            rel="noopener noreferrer"
                            href="/"
                            className="tw-no-underline tw-max-w-screen-desktop"
                            id="Container-title"
                        >
                            🍇 Vita Del Vino
                        </a>
                    </h1>
                </div>
                <div className="tw-grid tw-grid-flow-col tw-items-center tw-justify-start md:tw-justify-end tw-gap-5 ">
                    <Dropdown
                        overlayClassName="tw-bg-red tw-rounded-md tw-shadow-md tw-border tw-border-gray-200"
                        menu={{ items }}
                    >
                        <a
                            id="button"
                            onClick={handleLinkClick}
                            className="tw-cursor-pointer tw-flex tw-items-center tw-space-x-2 tw-py-2 tw-px-3 tw-bg-customPurple tw-rounded-md tw-shadow-md tw-border tw-border-gray-200"
                        >
                            <Space>
                                <UserOutlined rev={undefined} />
                                {currentUser}
                                <DownOutlined rev={undefined} />
                            </Space>
                        </a>
                    </Dropdown>

                    <ThemeConfig />
                </div>
            </div>
        </div>
    );
};
export default Header;
