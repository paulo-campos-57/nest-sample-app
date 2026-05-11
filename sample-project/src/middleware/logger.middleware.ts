/*
This file defines the LoggerMiddleware class, which implements the NestMiddleware interface to create a custom middleware for 
logging HTTP requests and responses in the application.
The middleware logs the HTTP method and original URL of incoming requests, as well as the status code of outgoing responses. 
By applying this middleware to all routes in the AppModule, we can easily track and debug the flow of requests and responses throughout the application.
*/
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    console.log(`Response Status: ${res.statusCode}`);
    next();
  }
}
