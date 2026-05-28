import 'express';

declare global {

  namespace Express {

    interface Request {

      user?: {

        id: number;

        business_id: number;

        role: string;

      };

    }

  }

}

export {};