import { auth } from '@/auth'
import type { InternalAxiosRequestConfig } from 'axios'

const AxiosRequestIntrceptorConfigCallback = async (
    config: InternalAxiosRequestConfig,
) => {
    /** Get session and add auth token to request headers */
    try {
        // First, try to get token from client-side (localStorage or custom header)
        if (typeof window !== 'undefined') {
            // Client-side: try to get from localStorage or existing header
            const clientToken = localStorage.getItem('accessToken')
            
            if (clientToken) {
                config.headers.Authorization = `Bearer ${clientToken}`
                console.log('✅ Client-side token added to request:', config.url)
                return config
            }
            
            // Check if token already set in headers
            if (config.headers.Authorization) {
                console.log('✅ Token already in headers for request:', config.url)
                return config
            }
        } else {
            // Server-side: use NextAuth session
            const session = await auth()
            const token = session?.user?.accessToken

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
                console.log('✅ Server-side token added to request:', config.url)
                return config
            }
        }

        console.warn('⚠️ No auth token found for request:', config.url)
    } catch (error) {
        console.error('❌ Error getting auth token:', error)
    }

    return config
}

export default AxiosRequestIntrceptorConfigCallback
