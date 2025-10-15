import { Request, Response, NextFunction } from 'express';
import { VALID_USER_TYPES, UserType, USER_TYPES } from '../constants/userTypes';
import '../types/express';

/**
 * Validates that request has a valid user-type header
 */
export const validateUserType = (req: Request, res: Response, next: NextFunction): void => {
    const userType = req.headers['user-type'] as string;

    if (!userType) {
        res.status(401).json({ message: 'user-type header is required' });
        return;
    }

    if (!VALID_USER_TYPES.includes(userType as UserType)) {
        res.status(401).json({ message: 'Invalid user-type' });
        return;
    }

    // Store userType in request for easy access
    req.userType = userType as UserType;
    next();
};

/**
 * Middleware factory to check if user has required role
 */
export const requireRole = (allowedRoles: UserType[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userType = req.userType;

        if (!userType) {
            res.status(401).json({ message: 'user-type header is required' });
            return;
        }

        if (!allowedRoles.includes(userType)) {
            res.status(403).json({ message: 'Forbidden: insufficient permissions' });
            return;
        }

        next();
    };
};

/**
 * Convenience middleware for customer-only routes
 */
export const requireCustomer = requireRole([USER_TYPES.CUSTOMER]);

/**
 * Convenience middleware for officer-only routes
 */
export const requireOfficer = requireRole([USER_TYPES.OFFICER]);
