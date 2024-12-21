import useSWR from 'swr'

function fetcher(url: string) {
    return window.fetch(url).then((res) => res.json())
}

export function useEntries(url) {
    const { data, error } = useSWR(`${url}`, fetcher)

    return {
        entries: data,
        isLoading: !error && !data,
        isError: error,
    }
}
