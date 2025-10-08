import axios from 'axios';

// CoinCap v3 client
// NOTE: For security, consider moving the API key to an env variable (VITE_COINCAP_API_KEY)
const API_KEY = '57fd2a08257281a5bea7686763e58a84c1adfe573a3d327fc12d0cff3bc0e3d0';

const client = axios.create({
  baseURL: 'https://rest.coincap.io/v3',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    Accept: 'application/json',
  },
});

export default client;
