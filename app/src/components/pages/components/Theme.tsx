import React, {
    FC,
    Dispatch,
    ReactNode,
    Reducer,
    createContext,
    useContext,
    useEffect,
    useReducer,
} from 'react';

import { produce } from 'immer';

import { isNil } from 'lodash';

import { Switch, ConfigProvider, Select } from 'antd';

import { Locale } from 'antd/es/locale';

import enUS from 'antd/es/locale/en_US';
import itIT from 'antd/es/locale/it_IT';
import zhCN from 'antd/es/locale/zh_CN';

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

export const ThemeConfig: FC = () => {
    const context = useContext(ThemeContext);
    if (isNil(context)) return null;
    const { state, dispatch } = context;
    const toggleMode = () =>
        dispatch({ type: 'change_mode', value: state.mode === 'light' ? 'dark' : 'light' });
    const toggleLanguage = (language: any) =>
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
export const Theme: FC<{ data?: ThemeState; children?: ReactNode }> = ({ data = {}, children }) => {
    const [state, dispatch] = useReducer(ThemeReducer, data, (initData) => ({
        ...defaultThemeConfig,
        ...initData,
    }));
    useEffect(() => {
        localStorage.setItem('themeState', JSON.stringify(state));
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
