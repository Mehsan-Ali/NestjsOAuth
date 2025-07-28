import React, { useEffect, useState } from 'react'
import { authAPI } from '../APIs/Auth.api'

interface userProfile {
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}
export const HomePage = () => {
  const [user, setUser] = useState<userProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    authAPI.getCurrentUser(setUser, setLoading, setError)  
  })
  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Profile</h1>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Name:</span> {user?.name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user?.email}
        </p>
        <p>
          <span className="font-medium">User ID:</span> {user?._id}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{' '}
          {new Date(user?.createdAt || '').toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Updated At:</span>{' '}
          {new Date(user?.updatedAt || '').toLocaleString()}
        </p>
      </div>
    </div>
  )
}
