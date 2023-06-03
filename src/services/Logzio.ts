import logzio from 'logzio-nodejs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require('../../package.json');
export default class Logzio {
  private static instance: Logzio;
  private static INFO_LOG_LEVEL = 'info';
  private static DEBUG_LOG_LEVEL = 'debug';
  private static WARN_LOG_LEVEL = 'warn';
  private static ERROR_LOG_LEVEL = 'error';

  logger;

  public static getInstance() {
    if (!Logzio.instance) {
      Logzio.instance = new Logzio();
    }

    return Logzio.instance;
  }

  public resetInstance() {
    Logzio.instance = new Logzio();

    return Logzio.instance;
  }
  constructor() {
    this.logger = logzio.createLogger({
      token: process.env.LOGZIO_TOKEN,
      // host: 'listener.logz.io',
      // protocol: 'http',
      // port: '8070',
    });
  }

  error(message) {
    try {
      return this.sentLogs(Logzio.ERROR_LOG_LEVEL, message);
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  info(message) {
    try {
      return this.sentLogs(Logzio.INFO_LOG_LEVEL, message);
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  private sentLogs(level, message) {
    try {
      const logsWithadditionalParams = {
        app_name: 'ttp-be',
        app_version: pjson.version,
        app_environment: process.env.NODE_ENV,
        app_level: level,
        message: JSON.stringify(message),
      };

      console.log(
        `Logz.io at ${new Date().toUTCString()}: `,
        JSON.parse(logsWithadditionalParams.message)
      );

      this.logger.log(logsWithadditionalParams);
    } catch (err) {
      console.log('err', err);
    }
  }
}
