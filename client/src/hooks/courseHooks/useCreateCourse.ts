import { useState } from "react";
import axios from "axios";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import axiosInstance from "../../axiosInstance.ts";

interface CourseData {
    name: string;
    code: string;
    credits: number;
    departmentId: string;
    subjectTypeIds?: string[];
    courseBucketIds?: string[];
}

const useCreateCourse = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { notify } = useNotification();

    const createCourse = async (courseData: CourseData): Promise<any> => {
        setLoading(true);
        setError(null);

        const createPromise = axiosInstance.post("/courses", courseData).then((response) => response.data);

        notify(
            "promise",
            "Creating course...",
            createPromise,
            "Failed to create course"
        );

        try {
            return await createPromise;
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || "Failed to create course");
            } else {
                setError("An unexpected error occurred");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createCourse, loading, error };
};

export default useCreateCourse;