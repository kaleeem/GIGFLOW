import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById, clearCurrentGig } from '../features/gig/gigSlice';
import { createBid, fetchBidsForGig, clearBids } from '../features/bid/bidSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import BidCard from '../components/BidCard';

/**
 * Gig Detail Page
 * Shows gig details, allows bidding, and shows bids for owner
 */

const GigDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentGig, loading: gigLoading } = useSelector((state) => state.gig);
    const { bids, loading: bidLoading } = useSelector((state) => state.bid);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [showBidForm, setShowBidForm] = useState(false);
    const [bidData, setBidData] = useState({
        message: '',
        price: ''
    });

    const isOwner = user && currentGig && user.id === currentGig.ownerId._id;

    useEffect(() => {
        dispatch(fetchGigById(id));

        return () => {
            dispatch(clearCurrentGig());
            dispatch(clearBids());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (isOwner && currentGig) {
            dispatch(fetchBidsForGig(id));
        }
    }, [dispatch, id, isOwner, currentGig]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Please login to place a bid');
            navigate('/login');
            return;
        }

        if (!bidData.message || !bidData.price) {
            toast.error('Please fill in all fields');
            return;
        }

        if (parseFloat(bidData.price) <= 0) {
            toast.error('Bid price must be greater than 0');
            return;
        }

        try {
            await dispatch(createBid({
                gigId: id,
                message: bidData.message,
                price: parseFloat(bidData.price)
            })).unwrap();

            toast.success('Bid submitted successfully!');
            setBidData({ message: '', price: '' });
            setShowBidForm(false);
        } catch (error) {
            toast.error(error || 'Failed to submit bid');
        }
    };

    if (gigLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
                <Navbar />
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
                </div>
            </div>
        );
    }

    if (!currentGig) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
                <Navbar />
                <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold text-white">Gig not found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Gig Card */}
                        <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-700 p-8 mb-8">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-3xl font-bold text-white pr-4">{currentGig.title}</h1>
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-medium shrink-0 ${currentGig.status === 'open'
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        }`}
                                >
                                    {currentGig.status === 'open' ? '● Open' : '● Assigned'}
                                </span>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-dark-700">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Budget</p>
                                    <p className="text-2xl font-bold text-primary-400">
                                        ${currentGig.budget.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Posted by</p>
                                    <p className="text-lg text-white font-medium">{currentGig.ownerId.name}</p>
                                    <p className="text-sm text-gray-400">{currentGig.ownerId.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Posted on</p>
                                    <p className="text-sm text-gray-300">
                                        {new Date(currentGig.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {currentGig.description}
                                </p>
                            </div>
                        </div>

                        {/* Bid Form */}
                        {!isOwner && currentGig.status === 'open' && isAuthenticated && (
                            <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-700 p-8">
                                {!showBidForm ? (
                                    <button
                                        onClick={() => setShowBidForm(true)}
                                        className="w-full bg-gradient-premium text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                                    >
                                        Place a Bid
                                    </button>
                                ) : (
                                    <form onSubmit={handleBidSubmit} className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white mb-4">Submit Your Bid</h2>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                                Proposal Message <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                id="message"
                                                value={bidData.message}
                                                onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                                                rows={5}
                                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                                placeholder="Explain why you're the best fit for this project..."
                                                maxLength={1000}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                                                Your Bid Amount (USD) <span className="text-red-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">$</span>
                                                <input
                                                    type="number"
                                                    id="price"
                                                    value={bidData.price}
                                                    onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                                                    className="w-full pl-8 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                                    placeholder="Enter your bid amount"
                                                    min="1"
                                                    max="1000000"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={bidLoading}
                                                className="flex-1 bg-gradient-success text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {bidLoading ? 'Submitting...' : 'Submit Bid'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowBidForm(false)}
                                                className="px-6 py-3 bg-dark-700 text-gray-300 rounded-lg font-semibold hover:bg-dark-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {!isAuthenticated && currentGig.status === 'open' && (
                            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-6 text-center">
                                <p className="text-primary-300 mb-4">Please login to place a bid on this gig</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-gradient-premium text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Login to Bid
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Bids (Owner Only) */}
                    {isOwner && (
                        <div className="lg:col-span-1">
                            <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-700 p-6 sticky top-24">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Bids ({bids.length})
                                </h2>

                                {bidLoading && (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500"></div>
                                    </div>
                                )}

                                {!bidLoading && bids.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">No bids yet</p>
                                    </div>
                                )}

                                {!bidLoading && bids.length > 0 && (
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                        {bids.map((bid) => (
                                            <BidCard key={bid._id} bid={bid} isOwner={isOwner} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GigDetail;
