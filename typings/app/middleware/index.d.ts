// This file is created by egg-ts-helper@1.30.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomeError from '../../../app/middleware/customeError';
import ExportCustomeJwt from '../../../app/middleware/customeJwt';
import ExportMyLogger from '../../../app/middleware/myLogger';

declare module 'egg' {
  interface IMiddleware {
    customeError: typeof ExportCustomeError;
    customeJwt: typeof ExportCustomeJwt;
    myLogger: typeof ExportMyLogger;
  }
}
