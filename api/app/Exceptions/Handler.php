<?php

namespace App\Exceptions;

use App\Http\Helpers;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    use Helpers;

    private array $transformValidationException = [
        [
            'password', // current key
            'The password confirmation does not match.', // value
            'password_confirmation' // new key
        ]
    ];


    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->renderable(function (Throwable $e) {

            if ($e instanceof NotFoundHttpException) {
                return response()->json([
                    'message' => env('APP_DEBUG') ? $e->getMessage() : 'Not found.',
                ], 404);
            }

            if ($e instanceof ValidationException) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'Validation failed',
                    'validationErrors' => $this->transformValidationKey($e->errors(), $this->transformValidationException),
                ], 422);
            }

            return response()->json([
                'message' => env('APP_DEBUG') ? $e->getMessage() : 'Something went wrong.',
            ], 500);
        });
    }
}
