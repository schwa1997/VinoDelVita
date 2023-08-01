// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import CompanyInfo from './components/pages/User';
import VineyardsInfo from './components/pages/EditVineyards';
import NewInfo from './components/pages/AddNewInfo';
import EditArea from './components/pages/EditArea';
import ListReports from './components/pages/listReports';
import LandingPage from './components/pages';
import { UserProvider } from './components/pages/UserContext';
import LogOut from './components/pages/Logout';
import ListMarks from './components/pages/listMarks';
import ListVineyards from './components/pages/listVineyards';
import ListVineyardsAsAgronomist from './components/pages/listVineyardsAsAgronomist';
import NewReport from './components/pages/AddReport';

const App: React.FC = () => {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/index" />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/maps" element={<ListMarks />} />
                    <Route path="/users/login" element={<Login />} />
                    <Route path="/users/logout" element={<LogOut />} />
                    <Route path="/users/signup" element={<SignUp />} />
                    <Route path="/users/info" element={<CompanyInfo />} />
                    <Route path="/users/vineyards" element={<VineyardsInfo />} />
                    <Route path="/users/new" element={<NewInfo />} />
                    <Route path="/users/editArea" element={<EditArea />} />
                    <Route path="/users/ListReports" element={<ListReports />} />
                    <Route path="/newReport" element={<NewReport />} />
                    <Route path="/users/ListVineyards" element={<ListVineyards />} />
                    <Route
                        path="/aronomists/ListVineyards"
                        element={<ListVineyardsAsAgronomist />}
                    />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
};

export default App;
