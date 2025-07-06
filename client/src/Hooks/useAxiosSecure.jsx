import axios from 'axios'
import { use } from 'react'
import {AuthContext} from '../Contexts/Authprovider.jsx';


const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
})

const useAxiosSecure = () => {
    const { saveUser, logOut } = use(AuthContext)
    // const token = localStorage.getItem('token')
    const token = saveUser?.accessToken
    //   intercept requests
    axiosInstance.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${token}`

        return config
    })

    //   intercept responses
    axiosInstance.interceptors.response.use(
        res => res,
        err => {
            if (err.status === 401 || err.status === 403) {
                logOut()
                    .then(() => {
                        console.log(
                            `You are logged out because of an error with ${err.status} code.`
                        )
                    })
                    .catch(err => console.log(err))
            }
            return Promise.reject(err)
        }
    )

    return axiosInstance
}

export default useAxiosSecure