import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDB } from '$lib/db';
import User from '$lib/models/User';
import { JWT_SECRET } from '$env/static/private';


// Connect to DB
await connectToDB();

export async function POST({ request }) {
    const { username, password, action } = await request.json();

    if (action === 'signup') {
        // Sign up logic
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return json({ error: 'Username already exists' }, { status: 400 });
        }

        const user = new User({
            username,
            passwordHash: password, // bcrypt will hash it before saving
        });

        try {
            await user.save();
            return json({ message: 'User created successfully' }, { status: 201 });
        } catch (err) {
            return json({ error: 'Error creating user' }, { status: 500 });
        }
    }

    if (action === 'login') {
        // Login logic
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        return json({ token }, { status: 200 });
    }

    return json({ error: 'Invalid action' }, { status: 400 });
}
