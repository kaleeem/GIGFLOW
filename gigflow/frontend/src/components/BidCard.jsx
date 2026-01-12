import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hireBid } from '../features/bid/bidSlice';
import { toast } from 'react-toastify';

/**
 * Bid Card Component
 * Displays bid information with hire functionality
 */

const BidCard = ({ bid, isOwner }) => {
    const { freelancerId, message, price, status, _id } = bid;
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.bid);

    const handleHire = async () => {
        if (window.confirm(`Are you sure you want to hire ${freelancerId?.name}?`)) {
            try {
                await dispatch(hireBid(_id)).unwrap();
                toast.success(`${freelancerId?.name} has been hired successfully!`);
            } catch (error) {
                toast.error(error || 'Failed to hire');
            }
        }
    };

    const getStatusStyle = () => {
        switch (status) {
            case 'hired':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    return (
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-dark-600 transition-colors">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                        {freelancerId?.name || 'Unknown User'}
                    </h4>
                    <p className="text-sm text-gray-400">{freelancerId?.email}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Bid Amount</p>
                    <p className="text-2xl font-bold text-primary-400">
                        ${price.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Message */}
            <div className="mb-4">
                <p className="text-sm text-gray-400 leading-relaxed">{message}</p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle()}`}>
                    {status === 'pending' && '⏳ Pending'}
                    {status === 'hired' && '✓ Hired'}
                    {status === 'rejected' && '✗ Rejected'}
                </span>

                {isOwner && status === 'pending' && (
                    <button
                        onClick={handleHire}
                        disabled={loading}
                        className="bg-gradient-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Hire'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BidCard;
