import { UserType } from '../constants/userTypes';

declare global {
    namespace Express {
        interface Request {
            userType?: UserType;
        }
    }
}

export {};

