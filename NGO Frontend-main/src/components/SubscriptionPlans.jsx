import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from './common/LoadingSpinner';
import useAuthRedirect from '../hooks/useAuthRedirect';
import apiRequest from '../utils/apifile';

const SubscriptionPlans = () => {
    const navigate = useNavigate();
    const { loading: authLoading } = useAuthRedirect();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await apiRequest.get('/subscriptions/plans');
                setPlans(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch subscription plans. Please try again later.');
                console.error('Error fetching plans:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    const handleContinue = () => {
        if (selectedPlan) {
            navigate('/create-ngo', { 
                state: { 
                    planId: selectedPlan.id,
                    planDetails: selectedPlan // Pass the entire plan details
                } 
            });
        }
    };

    const formatDescription = (description) => {
        if (!description) return [];
        return description.split('\n').filter(line => line.trim());
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount / 100);
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="large" color="indigo" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-center"
                >
                    {error}
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
                <p className="text-xl text-gray-600">Select the perfect plan for your NGO</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-lg shadow-lg p-8 ${
                            selectedPlan?.id === plan.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h2>
                            <p className="text-4xl font-bold text-indigo-600 mb-6">
                                {formatCurrency(plan.amount)}
                                <span className="text-lg text-gray-500">/{plan.period}</span>
                            </p>
                            
                            <div className="mb-6">
                                {formatDescription(plan.description).map((feature, idx) => (
                                    <p key={idx} className="text-gray-600 mb-2 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </p>
                                ))}
                            </div>

                            <div className="text-sm text-gray-500 mb-6">
                                <p>Billing Interval: Every {plan.interval} {plan.period}</p>
                            </div>

                            <button
                                onClick={() => handlePlanSelect(plan)}
                                className={`w-full py-3 px-4 rounded-md ${
                                    selectedPlan?.id === plan.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    disabled={!selectedPlan}
                    className={`px-8 py-3 rounded-md text-white font-medium ${
                        selectedPlan
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    Continue
                </motion.button>
            </div>
        </motion.div>
    );
};

export default SubscriptionPlans;