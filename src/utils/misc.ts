export function isAbortError(error: any): boolean {
    return error?.name === 'AbortError' || error?.code === 'ERR_CANCELED';
}