import { Test, TestingModule } from '@nestjs/testing';
import { BusinessErrorsInterceptor } from './business-errors.interceptor';
import { BusinessError } from '../errors/business-errors';
import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  CallHandler,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('BusinessErrorsInterceptor', () => {
  let interceptor: BusinessErrorsInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessErrorsInterceptor],
    }).compile();

    interceptor = module.get<BusinessErrorsInterceptor>(
      BusinessErrorsInterceptor,
    );

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as ExecutionContext;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should pass through successful responses', (done) => {
    const successResponse = { data: 'success' };
    mockCallHandler = {
      handle: () => of(successResponse),
    };

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (value) => {
        expect(value).toEqual(successResponse);
        done();
      },
    });
  });

  describe('error handling', () => {
    it('should transform BusinessError.NOT_FOUND to HttpException with NOT_FOUND status', (done) => {
      const errorMessage = 'Resource not found';
      const error = { type: BusinessError.NOT_FOUND, message: errorMessage };
      mockCallHandler = {
        handle: () => throwError(() => error),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });

    it('should transform BusinessError.PRECONDITION_FAILED to HttpException with PRECONDITION_FAILED status', (done) => {
      const errorMessage = 'Precondition failed';
      const error = {
        type: BusinessError.PRECONDITION_FAILED,
        message: errorMessage,
      };
      mockCallHandler = {
        handle: () => throwError(() => error),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });

    it('should transform BusinessError.BAD_REQUEST to HttpException with BAD_REQUEST status', (done) => {
      const errorMessage = 'Bad request';
      const error = { type: BusinessError.BAD_REQUEST, message: errorMessage };
      mockCallHandler = {
        handle: () => throwError(() => error),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });

    it('should pass through non-BusinessErrors unchanged', (done) => {
      const originalError = new Error('Original error');
      mockCallHandler = {
        handle: () => throwError(() => originalError),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBe(originalError);
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Original error');
          done();
        },
      });
    });

    it('should handle errors without type property', (done) => {
      const errorWithoutType = { message: 'Error without type' };
      mockCallHandler = {
        handle: () => throwError(() => errorWithoutType),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toEqual(errorWithoutType);
          done();
        },
      });
    });

    it('should handle errors without message property', (done) => {
      const errorWithoutMessage = { type: BusinessError.BAD_REQUEST };
      mockCallHandler = {
        handle: () => throwError(() => errorWithoutMessage),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          done();
        },
      });
    });

    it('should handle error objects with unexpected properties', (done) => {
      const unexpectedError = {
        type: 'UNKNOWN_ERROR',
        message: 'Unexpected error',
        additionalInfo: 'Some extra info',
      };
      mockCallHandler = {
        handle: () => throwError(() => unexpectedError),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toEqual(unexpectedError);
          done();
        },
      });
    });

    it('should handle error with empty message', (done) => {
      const error = { type: BusinessError.BAD_REQUEST, message: '' };
      mockCallHandler = {
        handle: () => throwError(() => error),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          done();
        },
      });
    });
  });
  describe('BusinessErrorsInterceptor', () => {
    let interceptor: BusinessErrorsInterceptor;
    let mockExecutionContext: ExecutionContext;
    let mockCallHandler: CallHandler;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [BusinessErrorsInterceptor],
      }).compile();

      interceptor = module.get<BusinessErrorsInterceptor>(
        BusinessErrorsInterceptor,
      );

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn(),
      } as ExecutionContext;
    });

    it('should be defined', () => {
      expect(interceptor).toBeDefined();
    });

    it('should pass through successful responses', (done) => {
      const successResponse = { data: 'success' };
      mockCallHandler = {
        handle: () => of(successResponse),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (value) => {
          expect(value).toEqual(successResponse);
          done();
        },
      });
    });

    describe('error handling', () => {
      it('should transform BusinessError.NOT_FOUND to HttpException with NOT_FOUND status', (done) => {
        const errorMessage = 'Resource not found';
        const error = { type: BusinessError.NOT_FOUND, message: errorMessage };
        mockCallHandler = {
          handle: () => throwError(() => error),
        };

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(HttpException);
            expect(err.getStatus()).toBe(HttpStatus.NOT_FOUND);
            expect(err.message).toBe(errorMessage);
            done();
          },
        });
      });

      it('should transform BusinessError.PRECONDITION_FAILED to HttpException with PRECONDITION_FAILED status', (done) => {
        const errorMessage = 'Precondition failed';
        const error = {
          type: BusinessError.PRECONDITION_FAILED,
          message: errorMessage,
        };
        mockCallHandler = {
          handle: () => throwError(() => error),
        };

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(HttpException);
            expect(err.getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
            expect(err.message).toBe(errorMessage);
            done();
          },
        });
      });

      it('should transform BusinessError.BAD_REQUEST to HttpException with BAD_REQUEST status', (done) => {
        const errorMessage = 'Bad request';
        const error = {
          type: BusinessError.BAD_REQUEST,
          message: errorMessage,
        };
        mockCallHandler = {
          handle: () => throwError(() => error),
        };

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(HttpException);
            expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
            expect(err.message).toBe(errorMessage);
            done();
          },
        });
      });

      it('should pass through non-BusinessErrors unchanged', (done) => {
        const originalError = new Error('Original error');
        mockCallHandler = {
          handle: () => throwError(() => originalError),
        };

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          error: (err) => {
            expect(err).toBe(originalError);
            done();
          },
        });
      });

      it('should handle errors without type property', (done) => {
        const errorWithoutType = { message: 'Error without type' };
        mockCallHandler = {
          handle: () => throwError(() => errorWithoutType),
        };

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          error: (err) => {
            expect(err).toEqual(errorWithoutType);
            done();
          },
        });
      });

      it('should handle errors without message property', (done) => {
        const errorWithoutMessage = { type: BusinessError.BAD_REQUEST };
        mockCallHandler = {
          handle: () => throwError(() => errorWithoutMessage),
        };

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(HttpException);
            expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
            done();
          },
        });
      });

      it('should handle error objects with unexpected properties', (done) => {
        const unexpectedError = {
          type: 'UNKNOWN_ERROR',
          message: 'Unexpected error',
          additionalInfo: 'Some extra info',
        };
        mockCallHandler = {
          handle: () => throwError(() => unexpectedError),
        };

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          error: (err) => {
            expect(err).toEqual(unexpectedError);
            done();
          },
        });
      });

      it('should handle error with empty message', (done) => {
        const error = { type: BusinessError.BAD_REQUEST, message: '' };
        mockCallHandler = {
          handle: () => throwError(() => error),
        };

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(HttpException);
            expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
            done();
          },
        });
      });
    });
  });

  // We recommend installing an extension to run jest tests.
});
