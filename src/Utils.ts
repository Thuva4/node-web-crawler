import {
  DISALLOWED_EXTENSIONS,
  INVALID_SCHEMES,
  VALID_SCHEME,
} from "./Constants";
import { MODULES, URL_STATUS } from "./Types";

/**
 * Get absolute URL from relative URL.
 * @param link
 * @param host
 * @param protocol
 * @returns string
 */
export const getUrl = (
  link: string,
  host: string,
  protocol: string
): string => {
  if (hasScheme(link)) {
    return link;
  } else if (link.startsWith("/")) {
    return `${protocol}//${host}${link}`;
  } else {
    return `${protocol}//${host}/${link}`;
  }
};

export const hasSameSubDomain = (a: string, b: string): boolean => {
  const { host: hostA } = new URL(a);
  const { host: hostB } = new URL(b);
  return hostA === hostB;
};

/**
 * Check the url is allowed to crawl(not a static file) and has valid scheme
 * TODO: can add url head call to check the content type
 * @param url
 * @returns boolean
 */
export const isAllowedUrl = (url: string): boolean => {
  return (
    VALID_SCHEME.some((scheme) => url.startsWith(scheme)) &&
    !DISALLOWED_EXTENSIONS.some((ext) => url.endsWith(ext))
  );
};

export const hasScheme = (link: string) => {
  return (
    VALID_SCHEME.some((scheme) => link.startsWith(scheme)) ||
    INVALID_SCHEMES.some((scheme) => link.startsWith(scheme))
  );
};

export const log = (message) => {
  process.stderr.write(message);
};

export const logStatus = (status: URL_STATUS, url: string, module: MODULES): void => {
  log(`${module}: ${status} ${url}\n`);
}

export const logError = (status: URL_STATUS, url: string, module: MODULES, message: string): void => {
  log(`${module}: ${status} ${url} ${message}\n`);
}