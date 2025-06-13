import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hero from '../../img/hero.png';

const Signup = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('patient');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        specialization: '',
        bio: '',
        availability: '',
        doctorCode: ''
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
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all required fields');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (userType === 'doctor') {
            if (!formData.specialization || !formData.bio || !formData.availability || !formData.doctorCode) {
                setError('Please fill in all required doctor fields');
                return false;
            }
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
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: userType,
                ...(userType === 'doctor' && {
                    accessCode: formData.doctorCode,
                    specialization: formData.specialization,
                    bio: formData.bio,
                    availability: formData.availability.split(',').map(day => day.trim())
                })
            };

            const response = await api.post('/auth/signup', userData);

            if (response.data?.message === 'User registered successfully') {
                toast.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                throw new Error('Unexpected response from server');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Registration failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SignupStyled userType={userType}>
            <div className="container">
                <div className="left-section">
                    <div className="hero-content">
                        <h1>Join Heal Smart</h1>
                        <p>Your journey to better healthcare starts here</p>
                        <img src={hero} alt="Healthcare illustration" />
                    </div>
                </div>
                <div className="right-section">
                    <div className="form-container">
                        <h2>Create Account</h2>
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
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {userType === 'doctor' && (
                                <>
                                    <div className="form-group">
                                        <select
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            required
                                            className="specialization-select"
                                        >
                                            <option value="">Select Specialization</option>
                                            <option value="Dermatologist">Dermatologist</option>
                                            <option value="Cardiologist">Cardiologist</option>
                                            <option value="Endocrinologist">Endocrinologist</option>
                                            <option value="Gastroenterologist">Gastroenterologist</option>
                                            <option value="Rheumatologist">Rheumatologist</option>
                                            <option value="Neurologist">Neurologist</option>
                                            <option value="Pulmonologist">Pulmonologist</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            name="doctorCode"
                                            placeholder="Doctor Access Code"
                                            value={formData.doctorCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="availability"
                                            placeholder="Availability (e.g., Mon 10-12, Wed 3-6)"
                                            value={formData.availability}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            name="bio"
                                            placeholder="Short Bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                        />
                                    </div>
                                </>
                            )}

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                        <p className="login-link">
                            Already have an account? 
                            <button onClick={() => navigate('/login')}>
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </SignupStyled>
    );
};

const SignupStyled = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background; white;
    padding-bottom: 2vh;
    overflow-x: hidden;

   
    .container {
        display: flex;
        width: 100%;
        max-width: 1200px;
        min-height: 600px;
        background: rgba(234, 226, 240, 0.9);
        border-radius: 32px;
        backdrop-filter: blur(4.5px);
        overflow: hidden;
        // margin: 10px;
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

        .form-container {
            width: 100%;
            max-width: 400px;
            padding-bottom: 3rem;

            form {
                padding-bottom: ${props => props.userType === 'doctor' ? '2rem' : '1rem'};
            }
        }
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
        
        margin-bottom: 1.2rem;

        input, textarea, select {
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

        .specialization-select {
            background-color: white;
            cursor: pointer;

            &:hover {
                border-color: #9F7AEA;
            }

            option {
                color: #2D3748;
                padding: 0.5rem;
            }
        }

        textarea {
            resize: vertical;
            min-height: 30px;
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

    .login-link {
        margin-top: .5rem;
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

export default Signup;
