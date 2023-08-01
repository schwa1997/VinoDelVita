import React, {
    Dispatch,
    FC,
    ReactNode,
    Reducer,
    createContext,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import { produce } from 'immer';

import { isNil } from 'lodash';

import type { MenuProps } from 'antd';
import { Switch, ConfigProvider, Select, Dropdown, Space } from 'antd';

import { DownOutlined, UserOutlined } from '@ant-design/icons';

import { Locale } from 'antd/es/locale';

import enUS from 'antd/es/locale/en_US';
import itIT from 'antd/es/locale/it_IT';
import zhCN from 'antd/es/locale/zh_CN';

import { useUserContext } from './pages/UserContext';

export const LanguageContext = React.createContext(enUS);

export enum ThemeMode {
    LIGHT = 'light',
    DARK = 'dark',
}
export enum LangMode {
    EN = 'enUS',
    IT = 'itIT',
    CN = 'zhCN',
}
type LangType = {
    name: string;
    label: string;
    data: Locale;
};
export const languages: LangType[] = [
    {
        name: LangMode.EN,
        label: 'English(US)',
        data: enUS,
    },
    {
        name: LangMode.IT,
        label: 'Italian',
        data: itIT,
    },
    {
        name: LangMode.CN,
        label: 'Chinese (Simplified)',
        data: zhCN,
    },
];

const items: MenuProps['items'] = [
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/newReport">
                Add a report on map
            </a>
        ),
        key: '0',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/listReports">
                List Reports
            </a>
        ),
        key: '1',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/vineyards">
                Edit Vineyard
            </a>
        ),
        key: '2',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/editArea">
                Edit Area
            </a>
        ),
        key: '3',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/new">
                Add New Item
            </a>
        ),
        key: '4',
    },
    {
        type: 'divider',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/login">
                Log In
            </a>
        ),
        key: '5',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/signup">
                Sign Up
            </a>
        ),
        key: '6',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/logout">
                Log Out
            </a>
        ),
        key: '7',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/info">
                User Setting
            </a>
        ),
        key: '8',
    },
    {
        type: 'divider',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/maps">
                List Areas
            </a>
        ),
        key: '9',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/users/ListVineyards">
                List Vineyards
            </a>
        ),
        key: '10',
    },
    {
        type: 'divider',
    },
    {
        label: (
            <a target="_self" rel="noopener noreferrer" href="/aronomists/ListVineyards">
                List Vineyards as aronomists
            </a>
        ),
        key: '11',
    },
];

export type ThemeState = {
    mode: `${ThemeMode}`;
    language: `${LangMode}`;
};

export enum ThemeActionType {
    CHANGE_MODE = 'change_mode',
    CHANGE_LANGUAGE = 'change_language',
}

export type ThemeAction =
    | { type: `${ThemeActionType.CHANGE_MODE}`; value: `${ThemeMode}` }
    | { type: `${ThemeActionType.CHANGE_LANGUAGE}`; value: `${LangMode}` };

export type ThemeContextType = {
    state: ThemeState;
    dispatch: Dispatch<ThemeAction>;
};

export const defaultThemeConfig: ThemeState = {
    mode: 'light',
    language: 'enUS',
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeReducer: Reducer<ThemeState, ThemeAction> = produce((draft, action) => {
    switch (action.type) {
        case 'change_mode':
            draft.mode = action.value;
            break;
        case 'change_language':
            draft.language = action.value;
            break;
        default:
            break;
    }
});

export const Theme: FC<{ data?: ThemeState; children?: ReactNode }> = ({ data = {}, children }) => {
    const [state, dispatch] = useReducer(ThemeReducer, data, (initData) => ({
        ...defaultThemeConfig,
        ...initData,
    }));
    useEffect(() => {
        if (state.mode === 'dark') {
            document.documentElement.setAttribute('data-theme', 'tw-dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [state.mode]);
    const languageLocale = languages.find((language) => language.name === state.language);
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <ThemeContext.Provider value={{ state, dispatch }}>
            <ConfigProvider locale={languageLocale?.data}>{children}</ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const ThemeConfig: FC = () => {
    const context = useContext(ThemeContext);
    if (isNil(context)) return null;
    const { state, dispatch } = context;
    const toggleMode = () =>
        dispatch({ type: 'change_mode', value: state.mode === 'light' ? 'dark' : 'light' });
    const toggleLanguage = (language: string) =>
        dispatch({
            type: 'change_language',
            value: language,
        });
    return (
        <>
            <Switch
                checkedChildren="🌛"
                unCheckedChildren="☀️"
                onChange={toggleMode}
                checked={state.mode === 'dark'}
                defaultChecked={state.mode === 'dark'}
            />
            <Select defaultValue="Language" onChange={(value) => toggleLanguage(value)}>
                {languages.map(({ name, label }) => (
                    <Select.Option key={name} value={name}>
                        {label}
                    </Select.Option>
                ))}
            </Select>
        </>
    );
};

const Header: FC = () => {
    const { currentUser } = useUserContext();
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
                <div className="tw-grid tw-grid-flow-col tw-items-center tw-justify-start md:tw-justify-end tw-gap-5">
                    <Dropdown menu={{ items }}>
                        <a onClick={handleLinkClick} className="tw-cursor-pointer ">
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
