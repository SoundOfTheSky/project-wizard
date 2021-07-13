import { Injectable } from '@nestjs/common';

/**
 * If more than 60 requests in one minute from one ip,
 * enable throttling (+250ms for each consequent request).
 * If more than 120 requests in one minute, then send errors.
 */
@Injectable()
export class GlobalGuard {
  constructor() {
    // Garbage collection
    setInterval(() => {
      Object.keys(this.ips).forEach(ip => {
        this.ips[ip] = this.ips[ip].filter(el => Date.now() - el < this.countRequestsInterval);
        if (this.ips[ip].length === 0) delete this.ips[ip];
      });
    }, this.garbageCollectionInterval);
  }
  // Interval in which requests is counted. After interval requests are disposed.
  countRequestsInterval = 60000;
  // Minimum requests from same ip in interval to enable throttling.
  minRequestsToEnableThrottling = 60;
  // Throttle request for X ms for each cosequent requests after minimum.
  throttlingPenaltyForEachRequest = 250;
  // Maximum requests from same ip in interval to start sending errors.
  maxRequestsUntilError = 120;
  // Interval between removing unused ips.
  // Garbage collection may lag a server if a lot of users!!!
  garbageCollectionInterval = 24 * 60 * 60 * 1000;

  ips = {};
  canActivate(context) {
    return new Promise(r => {
      const ip = context.switchToHttp().getRequest().ip;
      this.ips[ip] = (this.ips[ip] || []).filter(el => Date.now() - el < this.countRequestsInterval);
      this.ips[ip].push(Date.now());
      if (this.ips[ip].length < this.minRequestsToEnableThrottling) r(true);
      else if (this.ips[ip].length > this.maxRequestsUntilError) r(false);
      else setTimeout(() => r(true), (this.ips[ip].length - 60) * this.throttlingPenaltyForEachRequest);
    });
  }
}
