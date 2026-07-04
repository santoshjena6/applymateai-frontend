/**
 * Service for handling resume-related API calls.
 */
export const uploadResume = async (resumeFile) => {
    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
        const response = await fetch("/api/resume/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            let errorMessage = "Backend server error";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || `Server returned ${response.status}`;
            } catch (parseErr) {
                const errorText = await response.text();
                errorMessage = errorText || `Server returned ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        // Just rethrow the clean error, let the component handle logging/display
        throw error;
    }
};

/**
 * Service for fetching filtered jobs.
 * @param {Object} filters - { role, location, source, experience }
 */
export const getFilteredJobs = async (filters) => {
    const queryParams = new URLSearchParams();

    if (filters.role) queryParams.append("query", filters.role);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.source) queryParams.append("source", filters.source);
    if (filters.experience) queryParams.append("experience", filters.experience);

    try {
        const response = await fetch(`/api/jobs/search?${queryParams.toString()}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("fetch jobs error detailed:", error);
        throw error;
    }
};
