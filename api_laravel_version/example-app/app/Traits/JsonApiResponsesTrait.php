<?php

namespace App\Traits;

use Illuminate\Http\Response;
use Illuminate\Support\MessageBag;

trait JsonApiResponsesTrait {

    /**
     * @param string $msg
     * @return \Illuminate\Http\JsonResponse
     */
    protected function jsonHttpOkResponse(string $msg = 'OK'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => $msg,
        ], Response::HTTP_OK);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    protected function jsonHttpInternalErrorResponse(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status'  => Response::HTTP_INTERNAL_SERVER_ERROR,
            'message' => 'Internal server error',
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * @param array|MessageBag $validationErrors
     * @param string $msg
     * @return \Illuminate\Http\JsonResponse
     */
    protected function jsonHttpBadRequestResponse($errors = [], string $msg = 'Bad request' ): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status'  => Response::HTTP_BAD_REQUEST,
            'message' => $msg,
            'errors'  => !empty($errors) ? $errors : 'Errors list unavailable',
        ], Response::HTTP_BAD_REQUEST);
    }

    /**
     * @param string $msg
     * @return \Illuminate\Http\JsonResponse
     */
    protected function jsonHttpCreatedResponse(string $msg = 'Record was successfully created'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status'  => Response::HTTP_CREATED,
            'message' => $msg,
        ], Response::HTTP_CREATED);
    }

    /**
     * @param string $msg
     * @return \Illuminate\Http\JsonResponse
     */
    protected function jsonHttpNotFoundResponse(string $msg = 'Resource not found'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status'  => Response::HTTP_NOT_FOUND,
            'message' => $msg,
        ], Response::HTTP_NOT_FOUND);
    }

    /**
     * @param string $msg
     * @return \Illuminate\Http\JsonResponse
     */
    protected function jsonHttpNoContentResponse(string $msg = 'No content'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status'  => Response::HTTP_NO_CONTENT,
            'message' => $msg,
        ], Response::HTTP_NO_CONTENT);
    }

}

