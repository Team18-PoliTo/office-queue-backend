import { Request, Response, NextFunction } from 'express';
import { validateUserType, requireRole, requireCustomer, requireOfficer } from '../../src/middleware/authMiddleware';
import { USER_TYPES } from '../../src/constants/userTypes';

describe('authMiddleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        nextFunction = jest.fn();
    });

    describe('validateUserType', () => {
        it('should return 401 when user-type header is missing', () => {
            validateUserType(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'user-type header is required' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should return 401 when user-type is invalid', () => {
            mockRequest.headers = { 'user-type': 'invalid' };

            validateUserType(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid user-type' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should return 401 when user-type is manager (not allowed yet)', () => {
            mockRequest.headers = { 'user-type': 'manager' };

            validateUserType(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid user-type' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should call next() and set userType when user-type is customer', () => {
            mockRequest.headers = { 'user-type': 'customer' };

            validateUserType(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockRequest.userType).toBe('customer');
            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should call next() and set userType when user-type is officer', () => {
            mockRequest.headers = { 'user-type': 'officer' };

            validateUserType(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockRequest.userType).toBe('officer');
            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('requireRole', () => {
        beforeEach(() => {
            mockRequest.userType = USER_TYPES.CUSTOMER;
        });

        it('should return 401 when userType is not set', () => {
            delete mockRequest.userType;
            const middleware = requireRole([USER_TYPES.CUSTOMER]);

            middleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'user-type header is required' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should return 403 when user does not have required role', () => {
            mockRequest.userType = USER_TYPES.CUSTOMER;
            const middleware = requireRole([USER_TYPES.OFFICER]);

            middleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: insufficient permissions' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should call next() when user has required role', () => {
            mockRequest.userType = USER_TYPES.CUSTOMER;
            const middleware = requireRole([USER_TYPES.CUSTOMER]);

            middleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should call next() when user has one of multiple allowed roles', () => {
            mockRequest.userType = USER_TYPES.OFFICER;
            const middleware = requireRole([USER_TYPES.CUSTOMER, USER_TYPES.OFFICER]);

            middleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('requireCustomer', () => {
        it('should allow customer', () => {
            mockRequest.userType = USER_TYPES.CUSTOMER;

            requireCustomer(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should reject officer', () => {
            mockRequest.userType = USER_TYPES.OFFICER;

            requireCustomer(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });

    describe('requireOfficer', () => {
        it('should allow officer', () => {
            mockRequest.userType = USER_TYPES.OFFICER;

            requireOfficer(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should reject customer', () => {
            mockRequest.userType = USER_TYPES.CUSTOMER;

            requireOfficer(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });
});

