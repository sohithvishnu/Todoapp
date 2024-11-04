import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 's3cr3t_k3y_1234567890abcdefg';

// Example user; replace with your user database
const users = [
    { username: 'admin', passwordHash: bcrypt.hashSync('admin', 10) }
];

export async function POST({ request }) {
    const { username, password } = await request.json();

    // Check if the user exists
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        return json({ token }, { status: 200 });
    } else {
        return json({ error: 'Invalid credentials' }, { status: 401 });
    }
}
