import { AxiosError } from "axios";

type ErrorResponse = {
  success: false;
  error: string;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

const handleRequest = async <T>(
  requestFn: () => Promise<{ data: T }>
): Promise<T | ErrorResponse> => {
  try {
    const res = await requestFn();

    return res.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return {
      success: false,
      error:
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong",
    };
  }
};

export default handleRequest;