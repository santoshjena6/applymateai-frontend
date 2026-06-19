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
            const errorText = await response.text();
            console.error(`[ResumeUpload] Backend error ${response.status} ${response.statusText}:`, errorText);
            throw new Error(`Failed to upload resume: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error uploading resume:", error);
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
