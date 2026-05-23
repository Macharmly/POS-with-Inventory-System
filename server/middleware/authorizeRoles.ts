import {
  Response,
  NextFunction
} from 'express';

import {
  AuthRequest
} from './authenticateToken';

export default function authorizeRoles(
  ...allowedRoles: string[]
) {

  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {

    if (!req.user) {

      return res.status(401).json({
        error: 'Unauthorized'
      });

    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {

      return res.status(403).json({
        error: 'Access denied'
      });

    }

    next();

  };

}