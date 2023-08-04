// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import CompanyInfo from './components/pages/UserSetting';
import NewInfo from './components/pages/AddNewInfo';
import EditArea from './components/pages/EditArea';
import LandingPage from './components/pages';
import LogOut from './components/pages/Logout';
import NewReport from './components/pages/AddReport';
import ListReportByRoles from './components/pages/ListReportsPage';
import EditVineyard from './components/pages/EditVineyard';
import ListVineyardByRoles from './components/pages/listVineyards';
import ListAreas from './components/pages/ListAreas';
import Header from './components/pages/components/header';
import { Theme } from './components/pages/components/Theme';

const App: React.FC = () => {
    const savedThemeState = JSON.parse(localStorage.getItem('themeState') || '{}');

    return (
        <Theme data={savedThemeState}>
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/users/areas" element={<ListAreas />} />
                    <Route path="/users/login" element={<Login />} />
                    <Route path="/users/logout" element={<LogOut />} />
                    <Route path="/users/signup" element={<SignUp />} />
                    <Route path="/users/info" element={<CompanyInfo />} />
                    <Route path="/role/edit/vineyard" element={<EditVineyard />} />
                    <Route path="/users/new" element={<NewInfo />} />
                    <Route path="/role/edit/area" element={<EditArea />} />
                    <Route path="/role/list/vineyard" element={<ListVineyardByRoles />} />
                    <Route path="/users/ListReports" element={<ListReportByRoles />} />
                    <Route path="/newReport" element={<NewReport />} />
                </Routes>
            </BrowserRouter>
        </Theme>
    );
};

export default App;
