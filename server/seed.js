import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Define multiple users
    const usersData = [
      {
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123',
        avatar: 'https://i0.wp.com/wildearth.tv/wp-content/uploads/2022/07/Rick-Sanchez-avatar.jpeg?ssl=1',
      },
      {
        username: 'morty',
        email: 'morty@example.com',
        password: 'morty123',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      {
        username: 'summer',
        email: 'summer@example.com',
        password: 'summer123',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      {
        username: 'beth',
        email: 'beth@example.com',
        password: 'beth123',
        avatar: 'https://i.pravatar.cc/150?img=7',
      },
      {
        username: 'jerry',
        email: 'jerry@example.com',
        password: 'jerry123',
        avatar: 'https://i.pravatar.cc/150?img=8',
      }
    ];

    // Insert or find users
    const users = [];
    for (const userData of usersData) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        user = new User({ ...userData, password: hashedPassword });
        await user.save();
        console.log(`User ${userData.username} created`);
      } else {
        console.log(`User ${userData.username} already exists`);
      }
      users.push(user);
    }

    // Remove old posts for these users
    await Post.deleteMany({ user: { $in: users.map(u => u._id) } });

    // Create sample posts for each user
    const postsData = [
      {
        caption: 'Welcome to MY Deadstagram!',
        image: 'uploads/i.jpeg',
        user: users[0]._id,
      },
      {
        caption: 'Sample post #2',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        user: users[0]._id,
      },
      {
        caption: 'Enjoying the sunshine!',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        user: users[0]._id,
      },
      {
        caption: 'Morty’s first adventure!',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
        user: users[1]._id,
      },
      {
        caption: 'Summer’s selfie!',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        user: users[2]._id,
      },
      {
        caption: 'Beth at the stables',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        user: users[3]._id,
      },
      {
        caption: 'Jerry’s big idea',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
        user: users[4]._id,
      }
    ];

    await Post.insertMany(postsData);
    console.log('Sample posts created for all users');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
