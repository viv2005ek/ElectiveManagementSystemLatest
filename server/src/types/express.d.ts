// types/express.d.ts
import { User } from '../UserTypes'; // Ensure this is correct

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
