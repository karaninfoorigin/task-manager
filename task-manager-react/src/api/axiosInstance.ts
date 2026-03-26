import axios from 'axios';
import { useLocation } from 'react-router-dom';
//  sending each request with credentials
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

// Response Interceptor, Call refresh token when 401 response come.
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original = error.config;

//     if (error.response?.status === 401 && !original._retry ) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => api(original))
//           .catch((err) => Promise.reject(err));
//       }

//       original._retry = true;
//       isRefreshing = true;

//       try {
//         await axios.get('http://localhost:8000/token/refresh-token',{
//           withCredentials:true
//         });
//         processQueue(null);
//         return api(original);
//       } catch (err) {
//         console.log(err)
//         const navigate = useNavigate()
//         processQueue(err);
//         document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
//         navigate('/auth')
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    console.log(original.url.includes("/refresh-token"))
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes('/refresh-token')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await api.get('/token/refresh-token', {
          withCredentials: true,
        });

        processQueue(null);
        return api(original);
      } catch (err) {
        processQueue(err);

          if (window.location.pathname !== "/auth") {
    window.location.href = "/auth";
  }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
export default api;
