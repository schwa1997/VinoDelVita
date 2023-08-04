import { commonRequest } from './axios';
// report api
export async function getAllReportsAsAdmin(orderBy: string, vineyard: string, page: number) {
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
    };
    if (vineyard) {
        console.log('use vineyard');
        const response = await commonRequest.get(
            `/reports?orderBy=${orderBy}&vineyard=${vineyard}&page=${page}`,
            { headers },
        );
        return response.data;
    }
    const response = await commonRequest.get('/reports?orderBy=createdAt', { headers });
    return response.data;
}

export async function paginateReports(orderBy: string, vineyard: string, page: number) {
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
    };
    console.log('vineyard', vineyard);
    if (vineyard) {
        console.log('use vineyard');
        const response = await commonRequest.get(
            `/reports/paginate?orderBy=${orderBy}&vineyard=${vineyard}&page=${page}`,
            { headers },
        );
        return response.data;
    }
    const response = await commonRequest.get(`/reports/paginate?orderBy=createdAt&page=${page}`, {
        headers,
    });
    console.log('responsef', response);
    return response.data;
}

export async function getReportByID(id: string) {
    const response = await commonRequest.get(`/reports/${id}`);
    return response.data;
}

export async function deleteReortByID(id: string) {
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
    };
    const response = await commonRequest.delete(`/reports/${id}`, { headers });
    return response.data;
}

export async function postReport(
    title: string,
    disease: string,
    description: string,
    area: string,
    vineyard: string,
    status: string,
) {
    // Validate input parameters
    if (!title || !disease || !description) {
        throw new Error('Missing required fields. Please provide all required data.');
    }

    console.log(title, disease, description, area, vineyard, status);
    // Continue with the API request if input is valid
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
    };

    const response = await commonRequest.post(
        '/reports',
        {
            title,
            disease,
            description,
            area,
            vineyard,
            status,
        },
        { headers },
    );
    return response.data;
}
export async function updateReport(
    id: string,
    title: string,
    disease: string,
    description: string,
    area: string,
    vineyard: string,
    status: string,
) {
    console.log(id, title, disease, description, area, vineyard, status);
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
    };
    const response = await commonRequest.patch(
        '/reports',
        {
            id,
            title,
            disease,
            description,
            area,
            vineyard,
            status,
        },
        { headers },
    );
    return response.data;
}
// area api
export async function getAreas() {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };

    try {
        const response = await commonRequest.get('/areas', { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}
export async function getAreasByAdmin() {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };

    try {
        const response = await commonRequest.get('/areas/listAll', { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}
export async function getAreaByID(id: string) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.get(`/areas/${id}`, { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}

export async function updateArea(id: string, name: string, code: string, geometry: Coordinates) {
    console.log(id, name, code, geometry);
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.patch(
            '/areas/update',
            { id, name, code, geometry },
            { headers },
        );
        return response.data;
    } catch (error) {
        console.error('Error updating area:', error);
        throw error;
    }
}
export async function updateCompanyPSW(password: string) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.patch(
            '/companies/update/password',
            { password },
            { headers },
        );
        return response.data;
    } catch (error) {
        console.error('Error updating area:', error);
        throw error;
    }
}
export async function confirmPSW(password: string) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.post(
            '/companies/update/confirmpassword',
            { password },
            { headers },
        );
        return response.data;
    } catch (error) {
        console.error('Error updating area:', error);
        throw error;
    }
}
interface Coordinates {
    type: string;
    coordinates: number[][][];
}

// Define an interface for the data format

export async function createArea(name: string, code: string, geometry: Coordinates) {
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
    };
    try {
        const response = await commonRequest.post(
            '/areas/create',
            {
                name,
                code,
                geometry,
            },
            { headers },
        ); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error poosting areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}

export async function deleteArea(id: string) {
    const response = await commonRequest.delete(`/areas/${id}`);
    return response.data;
}

export async function deleteAreaByID(id: string) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    const response = await commonRequest.delete(`/areas/${id}`, { headers });
    return response.data;
}
// vineyard api
export async function getAllVineyards() {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.get('/vineyards', { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}
export async function getAllVineyardsAsAgronomists() {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.get('/vineyards/listByAdmin', { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}

export async function getAllVineyardsByUserID() {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.get('/vineyards/listVineyards', { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}

export async function getVineyardByID(id: string) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.get(`/vineyards/${id}`, { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}

export async function getVineyardByAreaID(id: string) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.get(`/vineyards/area/${id}`, { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}

export async function deleteVineyardByID(id: string) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    const response = await commonRequest.delete(`/vineyards/${id}`, { headers });
    return response.data;
}
export async function postVineyard(
    name: string,
    winetype: string,
    areanumber: string,
    yearofplanning: string,
    area: string,
    geometry: Coordinates,
) {
    console.log('api', name, winetype, areanumber, yearofplanning, area, geometry);
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.post(
            '/vineyards/area/create',
            {
                name,
                winetype,
                areanumber,
                yearofplanning,
                area,
                geometry,
            },
            { headers },
        );
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error post Vineyard:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}
export async function updateVineyard(
    id: string,
    name: string,
    winetype: string,
    areanumber: string,
    yearofplanning: string,
    area: string,
    execution: string,
    interventions: Array<string>,
    geometry: Coordinates,
) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.patch(
            '/vineyards',
            {
                id,
                name,
                winetype,
                areanumber,
                yearofplanning,
                area,
                execution,
                interventions,
                geometry,
            },
            { headers },
        );
        return response.data;
    } catch (error) {
        console.error('Error updating area:', error);
        throw error;
    }
}
// company api
export async function getAllCompanies() {
    const response = await commonRequest.get('/companies');
    // console.log(response.data);
    return response.data;
}

export async function getCompanyByID(id: string) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    const response = await commonRequest.get(`/companies/${id}`, { headers });
    return response.data;
}

export async function deleteCompanyByID(id: string) {
    const response = await commonRequest.delete(`/companies/${id}`);
    return response.data;
}
export async function postCompany(
    companyName: string,
    email: string,
    phone: string,
    password: string,
) {
    const role = '67c4eb62-143b-42f6-8740-fe47575dca69';
    const response = await commonRequest.post('/companies/signup', {
        companyName,
        email,
        phone,
        password,
        role,
    });
    return response.data;
}
export async function logIn(companyName: string, password: string) {
    try {
        const response = await commonRequest.post('/companies/auth/login', {
            companyName,
            password,
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error login:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}
export async function updateCompany(
    id: string,
    companyName: string,
    email: string,
    phone: string,
    password: string,
) {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    const response = await commonRequest.patch(
        '/companies/update',
        {
            id,
            companyName,
            email,
            phone,
            password,
        },
        { headers },
    );
    return response.data;
}
export async function getInterventionsAsAgronomists() {
    const jwtToken = localStorage.getItem('jwtToken'); // Get the JWT token from the local storage.
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Set the Authorization header with the JWT token.
    };
    try {
        const response = await commonRequest.get('interventions/listAll', { headers }); // Make the HTTP GET request to fetch areas.
        return response.data; // Return the data received from the server (array of areas).
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error to handle it at the caller's end.
    }
}
