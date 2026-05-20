import { useState, useEffect, useCallback } from "react";
import { AxiosResponse, AxiosError } from "axios";

import api from "../api/axios";

type UseAxiosFetchReturn<T> = {
  data: T | null;
  response: AxiosResponse<T> | null;
  fetchError: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

const useAxiosFetch = <T,>(
  dataUrl: string
): UseAxiosFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);

  const [response, setResponse] =
    useState<AxiosResponse<T> | null>(null);

  const [fetchError, setFetchError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const fetchData = useCallback(
    async (
      controller?: AbortController
    ): Promise<void> => {
      if (!dataUrl) return;

      setIsLoading(true);

      setFetchError(null);

      try {
        const res = await api.get<T>(dataUrl, {
          signal: controller?.signal,
        });

        setResponse(res);

        setData(res.data);
      } catch (err) {
        const error = err as AxiosError;

        if (error.name !== "CanceledError") {
          setFetchError(
            error.message || "Something went wrong"
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [dataUrl]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchData(controller);

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  const refetch = async (): Promise<void> => {
    await fetchData();
  };

  return {
    data,
    response,
    fetchError,
    isLoading,
    refetch,
  };
};

export default useAxiosFetch;