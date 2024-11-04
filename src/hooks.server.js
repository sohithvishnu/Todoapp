import jwt from 'jsonwebtoken';

const JWT_SECRET = 's3cr3t_k3y_1234567890abcdefg';

export async function handle({ event, resolve }) {
  const token = event.request.headers.get('Authorization')?.split(' ')[1];
  
  if (token) {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      event.locals.user = user;
    } catch {
      event.locals.user = null;
    }
  }
  
  return resolve(event);
}
