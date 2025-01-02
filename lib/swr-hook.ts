import useSWR, { SWRResponse } from 'swr';

async function fetcher<T>(url: string): Promise<T> {
    const response = await window.fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

/**
 * A custom hook for data fetching using SWR.
 * @param url The API endpoint to fetch data from.
 * @param customFetcher Optional custom fetcher function.
 * @returns An object containing the fetched data, loading state, and error state.
 */
export function useEntries<T>(url: string, customFetcher = fetcher) {
    const { data, error }: SWRResponse<T, Error> = useSWR(url, customFetcher);

    return {
        entries: data,
        isLoading: !error && !data,
        isError: error,
    };
}
