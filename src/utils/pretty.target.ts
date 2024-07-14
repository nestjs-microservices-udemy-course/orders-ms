import {
  blue,
  bold,
  gray,
  greenBright,
  red,
  whiteBright,
  yellow,
  yellowBright,
} from 'colorette';

import PinoPretty, { PrettyOptions } from 'pino-pretty';

export const prettyTarget = __filename;

const colouriseHttpMethod = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return greenBright(method);
    case 'POST':
      return yellowBright(method);
    case 'PUT':
      return blue(method);
    case 'DELETE':
      return red(method);
    default:
      return gray(method);
  }
};

const colouriseHttpStatusCode = (statusCode: number) => {
  if (statusCode >= 500) {
    return red(statusCode);
  }

  if (statusCode >= 400) {
    return yellowBright(statusCode);
  }

  if (statusCode >= 300) {
    return blue(statusCode);
  }

  if (statusCode >= 200) {
    return greenBright(statusCode);
  }

  return gray(statusCode);
};

export default (opts: PrettyOptions = {}) =>
  PinoPretty({
    ...opts,
    hideObject: true,
    translateTime: "SYS:yyyy-mm-dd'T'HH:MM:ss.lo",
    ignore: 'pid,hostname',
    customPrettifiers: {
      time: (time) => gray(time as string),
    },
    messageFormat: (log: unknown) => {
      if (typeof log !== 'object' || log === null) {
        // I really, really, really do not want our logger to every throw it's own errors so this whole formatting function has been written super defensively...
        return '';
      }

      let message = ``;

      // Handle HTTP request logging
      if ('request' in log && typeof log.request === 'object') {
        let requestDescription = ``;

        if ('id' in log.request && typeof log.request.id === 'number') {
          requestDescription += `${bold(log.request.id)} `;
        }

        if ('method' in log.request && typeof log.request.method === 'string') {
          requestDescription += `${colouriseHttpMethod(log.request.method)} `;
        }

        if ('url' in log.request && typeof log.request.url === 'string') {
          requestDescription += `${log.request.url}`;
        }

        message += `req=\`${requestDescription}\` `;
      }

      if ('context' in log && typeof log.context === 'string') {
        message += `${yellow(`[${log.context}]`)} `;
      }

      if ('msg' in log && typeof log.msg === 'string') {
        message += whiteBright(`msg=\`${log.msg}\` `);
      }

      if (
        'response' in log &&
        typeof log.response === 'object' &&
        log &&
        'statusCode' in log.response &&
        typeof log.response.statusCode === 'number' &&
        'responseTime' in log &&
        typeof log.responseTime === 'number'
      ) {
        message += `resp=\`${colouriseHttpStatusCode(log.response.statusCode)}/${log.responseTime.toFixed()}ms\` `;
      }

      return message.trim();
    },
  });
