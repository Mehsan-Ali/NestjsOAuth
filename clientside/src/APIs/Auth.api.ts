import axios from 'axios'

type User = {
  name: string
  email: string
  password: string
}

export const authAPI = {
  signup: async (user: User) => {
    try {
      const existing = await axios.post(
        'http://localhost:3000/auth/signup',
        user
      )
      const userData = existing.data
      console.log(userData)
      return Promise.resolve({
        message: 'Signup successful',
        userData
      })
    } catch (error: any) {
      console.log(error)
      return Promise.reject(error.response?.data)
    }
  },

  login: async (email: string, password: string) => {
    try {
      const user = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      })
      const userData = user.data

      // Store tokens
      localStorage.setItem('accessToken', userData.accessToken)
      localStorage.setItem('refreshToken', userData.refereshToken)

      console.log(userData)
      return Promise.resolve({
        message: 'Login successful',
        userData
      })
    } catch (error) {
      console.log(error)
    }
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) throw new Error('No refresh token found')

      const response = await axios.post(`http://localhost:3000/auth/refresh`, {
        refreshToken
      })

      const { accessToken } = response.data

      // Update token
      localStorage.setItem('accessToken', accessToken)

      return { accessToken }
    } catch (error: any) {
      console.error('Refresh token failed', error)
      throw error.response?.data || { message: 'Token refresh failed' }
    }
  },

  getCurrentUser: async (setUser: any, setLoading: any, setError: any) => {
    try {
      const token = localStorage.getItem('accessToken')
      setLoading(true)
      if (!token) {
        setLoading(false)
        setError('Not authenticated')
        throw new Error('Not authenticated')
      }
  
      const res = await axios.get('http://localhost:3000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(res.data)
      return res.data
    } catch (error: any) {
      setError(error.response?.data || 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }
}
