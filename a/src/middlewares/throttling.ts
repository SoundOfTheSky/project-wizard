/**
 * If more than 60 requests in one minute from one ip,
 * enable throttling (+250ms for each consequent request).
 * If more than 120 requests in one minute, then send errors.
 */

import { NextFunction, Request, Response } from 'express';

// Interval in which requests is counted. After interval requests are disposed.
const countRequestsInterval = 60000;
// Minimum requests from same ip in interval to enable throttling.
const minRequestsToEnableThrottling = 60;
// Throttle request for X ms for each cosequent requests after minimum.
const throttlingPenaltyForEachRequest = 250;
// Maximum requests from same ip in interval to start sending errors.
const maxRequestsUntilError = 120;
// Interval between removing unused ips.
// Garbage collection may lag a server if a lot of users!!!
const garbageCollectionInterval = 24 * 60 * 60 * 1000;
const ips: { [key: string]: number[] } = {};
setInterval(() => {
  Object.keys(ips).forEach(ip => {
    ips[ip] = ips[ip].filter(el => Date.now() - el < countRequestsInterval);
    if (ips[ip].length === 0) delete ips[ip];
  });
}, garbageCollectionInterval);
export default (req: Request, res: Response, next: NextFunction) => {
  console.log(req.ip);
  const ip = req.ip;
  ips[ip] = (ips[ip] || []).filter(el => Date.now() - el < countRequestsInterval);
  ips[ip].push(Date.now());
  if (ips[ip].length < minRequestsToEnableThrottling) next();
  else if (ips[ip].length > maxRequestsUntilError) res.status(400).json({ message: 'Too many requests.' });
  else setTimeout(() => next(), (ips[ip].length - minRequestsToEnableThrottling) * throttlingPenaltyForEachRequest);
};
