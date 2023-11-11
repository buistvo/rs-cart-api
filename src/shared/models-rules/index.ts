import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return (
    (request.user && request.user.id) ?? '5d27e3e9-5d22-4a57-8d41-42d7299f62ce'
  );
}
