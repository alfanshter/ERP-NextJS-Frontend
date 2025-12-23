import type { AxiosError } from 'axios'

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    /** handle response error here */
    console.error('❌ API Error:', error.response?.status, error.message)
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
        console.warn('⚠️ Token expired or invalid, redirecting to login...')
        
        // Clear token dari localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
            
            // Redirect ke login page
            window.location.href = '/sign-in'
        }
    }
}

export default AxiosResponseIntrceptorErrorCallback
