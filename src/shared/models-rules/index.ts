import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return (
    (request.user && request.user.id) ?? '5806fb80-1aa9-425f-a4b9-147deb710ae7'
  );
}
