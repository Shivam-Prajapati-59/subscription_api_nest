import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { aj } from '../../config/arcjet';

@Injectable()
export class ArcjetMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const decision = await aj.protect(req);

      console.log('Arcjet decision:', decision);

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return res.status(429).json({
            success: false,
            message: 'Too many requests',
            error: 'Rate limit exceeded',
          });
        }

        if (decision.reason.isBot()) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden - Bot detected',
            error: 'Bot traffic is not allowed',
          });
        }

        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: decision.reason,
        });
      }

      next();
    } catch (error) {
      console.error('Arcjet error:', error);
      next(error);
    }
  }
}
