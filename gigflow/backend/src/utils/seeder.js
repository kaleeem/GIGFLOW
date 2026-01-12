const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Gig = require('../models/Gig');
const Bid = require('../models/Bid');

// Load env vars
dotenv.config({ path: __dirname + '/../../.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Gig.deleteMany();
        await Bid.deleteMany();
        console.log('🧹 Cleared existing data...');

        // Create Users
        const users = await User.create([
            {
                name: 'John Client',
                email: 'client@example.com',
                password: 'password123'
            },
            {
                name: 'Jane Freelancer',
                email: 'freelancer@example.com',
                password: 'password123'
            },
            {
                name: 'Bob Builder',
                email: 'bob@example.com',
                password: 'password123'
            }
        ]);

        console.log('✅ Created 3 user accounts: client@example.com, freelancer@example.com, bob@example.com (password: password123)');

        // Create Gigs
        const gigs = await Gig.create([
            {
                title: 'Build a React E-commerce Site',
                description: 'I need a full-stack developer to build a modern e-commerce platform using React, Node.js, and MongoDB. Must include stripe integration.',
                budget: 1500,
                ownerId: users[0]._id,
                status: 'open'
            },
            {
                title: 'Design a Company Logo',
                description: 'Looking for a creative graphic designer to create a minimalist logo for my tech startup.',
                budget: 300,
                ownerId: users[0]._id,
                status: 'open'
            },
            {
                title: 'Fix Backend API Bugs',
                description: 'We have some issues with our Express API endpoints. Need an expert to debug and optimize.',
                budget: 500,
                ownerId: users[2]._id,
                status: 'open'
            }
        ]);

        console.log('✅ Created 3 sample gigs');

        console.log('🌱 Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error Seeding Database:', error);
        process.exit(1);
    }
};

seedData();
