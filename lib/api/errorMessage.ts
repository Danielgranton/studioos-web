export function getApiErrorMessage(error: unknown, fallback = "Please try again.") {
    const responseData = (error as {
        response?: {
            data?: {
                message?: string;
                error?: string;
                detail?: string;
                errors?: Record<string, string>;
            } | string;
        };
        message?: string;
    }).response?.data;

    if (typeof responseData === "string" && responseData.trim()) return responseData;

    if (!responseData || typeof responseData === "string") {
        return (error as { message?: string }).message || fallback;
    }

    if (responseData.message) return responseData.message;
    if (responseData.error) return responseData.error;
    if (responseData.detail) return responseData.detail;

    const fieldError = responseData.errors && Object.values(responseData.errors)[0];
    if (fieldError) return fieldError;

    return (error as { message?: string }).message || fallback;
}
