import { Request, Response, NextFunction } from 'express';

// TODO: Implement global error handling middleware

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // TODO: Handle errors
};

export default errorHandler;
