import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Gig Card Component
 * Displays gig information in a card format
 */

const GigCard = ({ gig }) => {
    const { _id, title, description, budget, status, ownerId, createdAt } = gig;

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <Link to={`/gig/${_id}`}>
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group cursor-pointer h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                        {title}
                    </h3>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${status === 'open'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}
                    >
                        {status === 'open' ? '● Open' : '● Assigned'}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
                    {truncateText(description, 150)}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-dark-700">
                    <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-lg font-bold text-primary-400">
                            ${budget.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Posted by</p>
                        <p className="text-sm text-gray-300">{ownerId?.name || 'Anonymous'}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GigCard;
