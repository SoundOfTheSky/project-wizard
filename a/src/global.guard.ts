import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

const ips: { [key: string]: number[] } = {};
/**
 * Simple anti ddos.
 * If there were more than 60 requests in one minute from one ip,
 * enable throttling (+250ms for each consequent request).
 * If more than 120 requests in one minute, then send errors.
 */
@Injectable()
export class GlobalGuard implements CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise((r) => {
      const ip = context.switchToHttp().getRequest().ip;
      ips[ip] = (ips[ip] || []).filter((el) => Date.now() - el < 60000);
      ips[ip].push(Date.now());
      if (ips[ip].length < 60) r(true);
      else if (ips[ip].length > 120) r(false);
      else setTimeout(() => r(true), (ips[ip].length - 60) * 250);
    });
  }
}
