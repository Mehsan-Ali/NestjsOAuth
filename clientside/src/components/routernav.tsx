import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'

export const Routernav = () => {
    return (
        <Routes>
            <Route path="/" Component={HomePage} />
            <Route path="/login" Component={LoginPage} />
            <Route path="/signup" Component={SignupPage} />
        </Routes>
    )
}
