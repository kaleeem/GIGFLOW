import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../features/gig/gigSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

/**
 * Create Gig Page
 * Form for posting new gigs
 */

const CreateGig = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.gig);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.budget) {
            toast.error('Please fill in all fields');
            return;
        }

        if (parseFloat(formData.budget) <= 0) {
            toast.error('Budget must be greater than 0');
            return;
        }

        try {
            await dispatch(createGig({
                ...formData,
                budget: parseFloat(formData.budget)
            })).unwrap();

            toast.success('Gig created successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error || 'Failed to create gig');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Post a New <span className="bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">Gig</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Share your project and connect with talented freelancers
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Gig Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                placeholder="e.g., Build a responsive website with React"
                                maxLength={100}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                placeholder="Describe your project in detail. Include requirements, deliverables, and any specific skills needed..."
                                maxLength={2000}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 characters</p>
                        </div>

                        {/* Budget */}
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                                Budget (USD) <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">$</span>
                                <input
                                    type="number"
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    placeholder="500"
                                    min="1"
                                    max="1000000"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-premium text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating gig...
                                </span>
                            ) : (
                                'Post Gig'
                            )}
                        </button>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
                    <p className="text-sm text-primary-300">
                        <span className="font-semibold">💡 Tip:</span> Be specific about your requirements and budget to attract the best freelancers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateGig;
