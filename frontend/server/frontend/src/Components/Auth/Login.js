import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hero from '../../img/hero.png';
import BlurredBackground from '../layouts/BlurredBackground';

const Login = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('patient');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTabChange = (type) => {
        setUserType(type);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error(error);
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
                role: userType
            });

            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
                const userData = {
                    id: response.data.userId,
                    role: response.data.role
                };
                localStorage.setItem('user', JSON.stringify(userData));

                if (response.data.role === 'doctor') {
                    navigate('/doctordashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Login failed. Please check your credentials and try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginStyled>
            <BlurredBackground />
            <div className="container">
                <div className="left-section">
                    <div className="hero-content">
                        <h1>Welcome Back to Heal Smart</h1>
                        <p>Your trusted healthcare companion</p>
                        <img src={hero} alt="Healthcare illustration" />
                    </div>
                </div>
                <div className="right-section">
                    <div className="form-container">
                        <h2>Sign In</h2>
                        <div className="tab-container">
                            <button
                                className={`tab-button ${userType === 'patient' ? 'active' : ''}`}
                                onClick={() => handleTabChange('patient')}
                            >
                                User
                            </button>
                            <button
                                className={`tab-button ${userType === 'doctor' ? 'active' : ''}`}
                                onClick={() => handleTabChange('doctor')}
                            >
                                Doctor
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                        <p className="signup-link">
                            Don't have an account?
                            <button onClick={() => navigate('/signup')}>
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </LoginStyled>
    );
};

const LoginStyled = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background; white;
    padding: 0px;
    overflow-x: hidden;

    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        display: flex;
        width: 100%;
        max-width: 1200px;
        min-height: 600px;
        background: rgba(242, 239, 245, 0.9);
        border-radius: 32px;
        backdrop-filter: blur(4.5px);
        overflow: hidden;
    }

    .left-section {
        flex: 1;
        background: linear-gradient(135deg,rgb(72, 42, 143), #9F7AEA);
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .hero-content {
        text-align: center;

        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }

        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        img {
            max-width: 80%;
            height: auto;
        }
    }

    .right-section {
        flex: 1;
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-y: auto;
    }

    .form-container {
        width: 100%;
        max-width: 400px;

        h2 {
            font-size: 2rem;
            color: #2D3748;
            margin-bottom: 2rem;
            text-align: center;
        }
    }

    .tab-container {
        display: flex;
        margin-bottom: 2rem;
        gap: 1rem;
        justify-content: center;
    }

    .tab-button {
        padding: 0.75rem 2rem;
        border: none;
        background: none;
        color: #4A5568;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;

        &.active {
            background: #6B46C1;
            color: white;
        }

        &:hover:not(.active) {
            background: #EDF2F7;
        }
    }

    .form-group {
        margin-bottom: 1.5rem;

        input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #E2E8F0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;

            &:focus {
                outline: none;
                border-color: #6B46C1;
            }

            &::placeholder {
                color: #A0AEC0;
            }
        }
    }

    .submit-button {
        width: 100%;
        padding: 1rem;
        background: #6B46C1;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;

        &:hover {
            background: #553C9A;
        }

        &:disabled {
            background: #A0AEC0;
            cursor: not-allowed;
        }
    }

    .signup-link {
        margin-top: 1.5rem;
        text-align: center;
        color: #4A5568;

        button {
            background: none;
            border: none;
            color: #6B46C1;
            font-weight: 600;
            cursor: pointer;
            margin-left: 0.5rem;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;
        
        .container {
            margin: 0;
            
        }

        .left-section {
            padding: 2rem;
        }

        .right-section {
            padding: 2rem;
        }

        .hero-content {
            h1 {
                font-size: 2rem;
            }

            p {
                font-size: 1rem;
            }
        }
    }
`;

export default Login;
