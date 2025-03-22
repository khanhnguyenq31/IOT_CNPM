import axios from 'axios';

export class AuthOperation {
    async loggedInByStaff(payload: any) {
        try {
            const response = await axios.post('http://localhost:5000/api/login', payload);
            return response.data; // Ensure this matches what your application expects
        } catch (error) {
            console.error('Login failed', error);
            throw error; // Let the caller handle the error
        }
    }
}