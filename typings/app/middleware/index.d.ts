// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomeError from '../../../app/middleware/customeError';
import ExportJwt from '../../../app/middleware/jwt';
import ExportMyLogger from '../../../app/middleware/myLogger';

declare module 'egg' {
  interface IMiddleware {
    customeError: typeof ExportCustomeError;
    jwt: typeof ExportJwt;
    myLogger: typeof ExportMyLogger;
  }
}
