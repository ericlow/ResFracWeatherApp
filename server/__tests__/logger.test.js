const logger = require('../logger.js')
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

jest.mock('winston', () => {
    const mConsole = { log: jest.fn() };
    const createLogger = jest.fn().mockReturnValue({
      info: jest.fn(),
      debug: jest.fn(),
    });
    return {
      transports: {
        Console: jest.fn(() => mConsole),
      },
      format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        printf: jest.fn(),
      },
      createLogger,
    };
  });

jest.mock('winston-daily-rotate-file', () => {
    return jest.fn();
  });

describe('logger', () => {

    it('should create a logger with the correct configuration', () => {
        // ARRANGE
        const expectedConfig = {
          level: 'debug',
          format: expect.anything(),
          transports: [
            expect.any(winston.transports.Console),
            expect.any(DailyRotateFile),
          ],
        };
    
        // ACT
        const createdLogger = winston.createLogger(expectedConfig);
    
        // ASSERT
        expect(winston.createLogger).toHaveBeenCalledWith(expectedConfig);
      });
});