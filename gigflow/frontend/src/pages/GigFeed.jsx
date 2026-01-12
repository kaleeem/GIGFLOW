import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../features/gig/gigSlice';
import GigCard from '../components/GigCard';
import Navbar from '../components/Navbar';

/**
 * Gig Feed Page
 * Public listing of all gigs with search functionality
 */

const GigFeed = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const dispatch = useDispatch();
    const { gigs, loading } = useSelector((state) => state.gig);

    useEffect(() => {
        dispatch(fetchGigs({ search, status: statusFilter }));
    }, [dispatch, search, statusFilter]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Discover Amazing <span className="bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">Opportunities</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Browse through hundreds of freelance gigs and start earning today
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search gigs by title or description..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full px-6 py-4 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-6 py-4 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    >
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="assigned">Assigned</option>
                    </select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
                    </div>
                )}

                {/* Gigs Grid */}
                {!loading && gigs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {gigs.map((gig) => (
                            <GigCard key={gig._id} gig={gig} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && gigs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">No gigs found</h3>
                        <p className="text-gray-400">
                            {search ? 'Try a different search term' : 'Be the first to post a gig!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GigFeed;
