import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import LoadingSpinner from './common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import apiRequest from '../utils/apifile';

const CreateNGO = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, updateUser, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        contactEmail: '',
        website: '',
        logo: '',
        socialMedia: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        },
        planId: location.state?.planId || '',
        planDetails: location.state?.planDetails || null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            console.log("No user found, redirecting to login");
            navigate('/login', { state: { from: location.pathname } });
        } else if (!authLoading && user) {
            console.log("Authenticated as:", user);
        }
    }, [user, authLoading, navigate, location]);

    useEffect(() => {
        if (!formData.planId) {
            navigate('/subscription-plans');
        }
    }, [formData.planId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('socialMedia.')) {
            const socialMediaKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                socialMedia: {
                    ...prev.socialMedia,
                    [socialMediaKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
// Project originally made by Nirmit Rampal(Original github repo: https://github.com/nirmt-124398/HopeOps) only
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setIsSubmitting(true);

        try {
            try {
                const checkAuthResponse = await apiRequest.get('/test/should-be-logged-in');
                console.log("Authentication check:", checkAuthResponse.data);
            } catch (authError) {
                console.error("Authentication check failed:", authError);
                if (authError.response?.status === 401) {
                    setError('Please log in to continue.');
                    // navigate('/login', { state: { from: location.pathname } });
                    return;
                }
            }

            // Log the data being sent to help with debugging
            const subscriptionPayload = {
                planId: formData.planId,
                ngoDetails: {
                    name: formData.name,
                    description: formData.description,
                    address: formData.address,
                    phone: formData.phone,
                    contactEmail: formData.contactEmail,
                    website: formData.website,
                    logo: formData.logo,
                    socialMedia: formData.socialMedia
                }
            };
            
            console.log('Sending subscription payload:', subscriptionPayload);

            const subscriptionResponse = await apiRequest.post('/subscriptions/create', subscriptionPayload);

            if (subscriptionResponse.data.success) {
                const { subscription } = subscriptionResponse.data;

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    subscription_id: subscription.id,
                    name: "NGO Management System",
                    description: "NGO Subscription",
                    handler: async function (response) {
                        try {
                            setIsSubmitting(true);
                            console.log('Razorpay response:', response);

                            const verifyResponse = await apiRequest.post('/subscriptions/verify', {
                                subscription_id: subscription.id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                razorpay_subscription_id: response.razorpay_subscription_id
                            });

                            console.log('Verification response:', verifyResponse.data);

                            if (verifyResponse.data.success) {
                                try {
                                    console.log('NGO creation payload:', {
                                        name: formData.name,
                                        description: formData.description,
                                        address: formData.address,
                                        phone: formData.phone,
                                        contactEmail: formData.contactEmail,
                                        website: formData.website,
                                        logo: formData.logo,
                                        socialMedia: formData.socialMedia,
                                        subscriptionId: verifyResponse.data.subscription.id,
                                        planId: verifyResponse.data.subscription.planId || formData.planId
                                    });

                                    const ngoResponse = await apiRequest.post('/ngos', {
                                        name: formData.name,
                                        description: formData.description,
                                        address: formData.address,
                                        phone: formData.phone,
                                        contactEmail: formData.contactEmail,
                                        website: formData.website,
                                        logo: formData.logo,
                                        socialMedia: formData.socialMedia,
                                        subscriptionId: verifyResponse.data.subscription.id,
                                        planId: verifyResponse.data.subscription.planId || formData.planId
                                    });

                                    console.log('NGO creation response:', ngoResponse.data);

                                    if (ngoResponse.data.success) {
                                        try {
                                            const updateRoleResponse = await apiRequest.put('/users/role',
                                                { role: 'NGO_ADMIN' }
                                            );
                                            console.log('User role updated:', updateRoleResponse.data);
                                        } catch (roleError) {
                                            console.error('Failed to update user role:', roleError);
                                        }

                                        updateUser({ ...user, role: 'NGO_ADMIN' });

                                        navigate('/', {
                                            state: {
                                                message: 'NGO created successfully!',
                                                ngo: ngoResponse.data.ngo
                                            }
                                        });
                                    }
                                } catch (error) {
                                    console.error('NGO creation error:', error);
                                    console.error('Error details:', error.response?.data);

                                    if (error.response?.status === 422) {
                                        const errorMsg = error.response?.data?.errors?.[0]?.message ||
                                            error.response?.data?.message ||
                                            'Validation failed. Please check your input.';
                                        setError(errorMsg);
                                    } else {
                                        setError(error.response?.data?.error || 'Failed to create NGO. Please try again.');
                                    }
                                }
                            } else {
                                setError(verifyResponse.data.message || 'Failed to verify subscription');
                            }
                        } catch (error) {
                            console.error('Verification error:', error);
                            const errorMessage = error.response?.data?.message ||
                                error.response?.data?.error ||
                                'Failed to verify subscription. Please try again.';
                            setError(errorMessage);
                            if (error.response?.status === 401) {
                                navigate('/login');
                            }
                        } finally {
                            setIsSubmitting(false);
                        }
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.contactEmail,
                        contact: formData.phone
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            }
        } catch (error) {
            console.error('Subscription creation error:', error);
            const errorResponse = error.response?.data;
            
            if (error.response?.status === 401) {
                setError('Please log in to continue.');
                navigate('/login');
            } else if (error.response?.status === 422) {
                // Validation error from Razorpay
                setError(errorResponse?.error || 'The payment gateway rejected the request. Please check your plan details.');
            } else if (errorResponse?.error) {
                // Specific error message from our backend
                setError(`Payment gateway error: ${errorResponse.error}`);
            } else {
                setError('Failed to create subscription. Please try again or contact support.');
            }
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Create Your NGO
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Fill in the details to create your NGO profile
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                NGO Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                id="contactEmail"
                                required
                                value={formData.contactEmail}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                id="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                        >
                            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                                Logo URL
                            </label>
                            <input
                                type="url"
                                name="logo"
                                id="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>

                            <div>
                                <label htmlFor="socialMedia.facebook" className="block text-sm font-medium text-gray-700">
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    name="socialMedia.facebook"
                                    id="socialMedia.facebook"
                                    value={formData.socialMedia.facebook}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="socialMedia.twitter" className="block text-sm font-medium text-gray-700">
                                    Twitter
                                </label>
                                <input
                                    type="url"
                                    name="socialMedia.twitter"
                                    id="socialMedia.twitter"
                                    value={formData.socialMedia.twitter}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700">
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    name="socialMedia.instagram"
                                    id="socialMedia.instagram"
                                    value={formData.socialMedia.instagram}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="socialMedia.linkedin" className="block text-sm font-medium text-gray-700">
                                    LinkedIn
                                </label>
                                <input
                                    type="url"
                                    name="socialMedia.linkedin"
                                    id="socialMedia.linkedin"
                                    value={formData.socialMedia.linkedin}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                    >
                        <motion.button
                            type="submit"
                            disabled={loading || isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                loading || isSubmitting
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {loading || isSubmitting ? (
                                <LoadingSpinner size="sm" color="white" />
                            ) : (
                                'Create NGO and Subscribe'
                            )}
                        </motion.button>
                    </motion.div>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default CreateNGO;