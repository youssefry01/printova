import { AxiosError } from "axios";

export const getErrorMessage = (err: unknown): string => {
  const error = err as AxiosError<{ message?: string }>;

  if (!error.response) return "No Server Response";

  const status = error.response.status;

  if (status === 400) return "Missing Username or Password";
  if (status === 401) return "Unauthorized";

  return error.response.data?.message || "Something went wrong";
};