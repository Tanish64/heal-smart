import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hero from '../../img/hero.png';
import BlurredBackground from '../layouts/BlurredBackground';

const Signup = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('patient');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        specialization: ''
        
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

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
            if (!formData.specialization) {
    setError('Please select a specialization');
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
            let imageUrl = '';

            if (userType === 'doctor' && image) {
                const form = new FormData();
                form.append('file', image);
                form.append('upload_preset', 'ml_default'); // ✅ correct
                form.append('cloud_name', 'dhelj5vrg');       // 🔁 Replace this

                const cloudinaryRes = await fetch('https://api.cloudinary.com/v1_1/dhelj5vrg/image/upload', {
                    method: 'POST',
                    body: form
                });

                const data = await cloudinaryRes.json();

                if (data.secure_url) {
                    imageUrl = data.secure_url;
                } else {
                    throw new Error('Image upload failed');
                }
            }

            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: userType,
                ...(userType === 'doctor' && {
                    specialization: formData.specialization,
                    image: imageUrl
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
            <BlurredBackground />
            <div className="container">
                <div className="left-section">
                    <div className="hero-content">
                        <h1>Join SymptoCare</h1>
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
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />
                                    </div>
                                    {image && (
                                        <div className="form-group">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                                            />
                                        </div>
                                    )}
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
    background: white;
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
  height: ${props => props.userType === 'doctor' ? 'calc(100vh - 4vh)' : '690px'};
  background: rgba(242, 239, 245, 0.9);
  border-radius: 32px;
  backdrop-filter: blur(4.5px);
  overflow: hidden;
  transition: height 0.6s ease-in-out;
}
    .left-section {
        flex: 1;
        background: linear-gradient(135deg, rgb(72, 42, 143), #9F7AEA);
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

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
    }

    .right-section {
        flex: 1;
        padding: ${props => props.userType === 'doctor' ? '5rem 3rem 3rem 3rem' : '3rem'};
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow: hidden;
        height: 100%;
        max-height: 100%;
        transition: padding 0.8s ease;
    }

    .form-container {
        width: 100%;
        max-width: 400px;

        overflow-y: ${props => props.userType === 'doctor' ? 'auto' : 'hidden'};
        max-height: ${props => props.userType === 'doctor' ? 'calc(100vh - 10rem)' : '100%'};
        padding-right: ${props => props.userType === 'doctor' ? '0.5rem' : '0'};
        transition: max-height 0.8s ease;

        form {
            padding-bottom: ${props => props.userType === 'doctor' ? '2rem' : '1rem'};
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            // background-color: #c4b5fd;
            border-radius: 4px;
        }

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

            option {
                color: #2D3748;
            }
        }

        textarea {
            resize: vertical;
            min-height: 30px;
        }
    }

    .image-preview img {
        max-width: 100%;
        height: auto;
        border-radius: 10px;
        margin-top: 1rem;
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
        margin-top: 1rem;
        text-align: center;
        font-size: 0.95rem;
        color: #4A5568;

        button {
            background: none;
            border: none;
            color: #6B46C1;
            cursor: pointer;
            margin-left: 0.25rem;
            font-weight: 600;
            text-decoration: underline;
            padding: 0;

            &:hover {
                color: #553C9A;
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .container {
            flex-direction: column;
            height: auto;
        }

        .left-section,
        .right-section {
            width: 100%;
            padding: 2rem;
            max-height: none;
        }

        .right-section {
            max-height: 80vh;
        }

        .form-container {
            max-height: 100%;
        }
    }
`;

export default Signup;
