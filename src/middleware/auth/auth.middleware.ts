import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let token: string | undefined;

      // Extract token from Authorization header
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, no token provided',
        });
      }

      // Verify token
      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          this.configService.get<string>('jwtSecret') ||
          process.env.JWT_SECRET ||
          'your-secret-key',
      });

      // Attach user info to request
      req['user'] = payload;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token',
      });
    }
  }
}
