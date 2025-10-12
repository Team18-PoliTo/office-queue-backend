import { Request, Response, NextFunction } from 'express';

// TODO: Implement authorization middleware
// Check user-type header (customer, officer, manager)

const authorize = (...allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement authorization logic
  };
};

export default authorize;
