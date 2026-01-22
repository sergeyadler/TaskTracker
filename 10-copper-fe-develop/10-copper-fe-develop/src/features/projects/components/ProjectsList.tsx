import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    getAllProjects,
    selectProjects,
    selectIsLoading,
    createProject,
    selectCreateProjectErrorMessage,
} from "../slice/projectsSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Project } from "../types";

const ProjectsList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const projects = useAppSelector(selectProjects);
    const isLoading = useAppSelector(selectIsLoading);
    const createError = useAppSelector(selectCreateProjectErrorMessage);

    const [showModal, setShowModal] = useState(false);

    // Loading projects when opening a page
    useEffect(() => {
        dispatch(getAllProjects());
    }, [dispatch]);

    // Navigation to the project
    const handleOpenProject = (projectId: string) => {
        navigate(`/projects/${projectId}`);
    };

    // Opening/closing a modal
    const handleCreateNewProject = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Form for creating a new project
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .required("Title is required")
                .matches(/^[A-ZА-Я].*$/, "Title must start with a capital letter"),
            description: Yup.string()
                .required("Description is required")
                .matches(/^[A-ZА-Я].*$/, "Description must start with a capital letter"),
        }),
        onSubmit: async (values, { resetForm }) => {
            const result = await dispatch(createProject(values));
            if (createProject.fulfilled.match(result)) {
                resetForm();
                setShowModal(false);
                dispatch(getAllProjects());
            }
        },
    });

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            {/* Title */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold">Projects</h1>
                <button
                    onClick={handleCreateNewProject}
                    className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    Create New Project
                </button>
            </div>

            {/*Loading status */}
            {isLoading && <p className="text-gray-500">Loading projects...</p>}

            {/* List of projects */}
            {!isLoading && projects.length === 0 && (
                <p className="text-gray-500 text-sm">You don't have any projects yet.</p>
            )}

            {!isLoading && projects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.map((project: Project) => (
                        <div
                            key={project.id}
                            onClick={() => handleOpenProject(project.id)}
                            className="cursor-pointer border rounded-lg shadow-sm hover:shadow-md p-4 bg-white transition"
                        >
                            <h2 className="text-lg font-semibold mb-2 text-gray-900 hover:text-black">
                                {project.title ?? "Untitled Project"}
                            </h2>
                            <p className="text-sm text-gray-600 line-clamp-3">
                                {project.description || "No description provided."}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal window for project creating */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg relative p-6">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold text-center mb-4">
                            Create New Project
                        </h2>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    {...formik.getFieldProps("title")}
                                    className={`w-full px-3 py-2 border rounded-md ${
                                        formik.touched.title && formik.errors.title
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="New Website Development"
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <p className="text-sm text-red-500">{formik.errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    {...formik.getFieldProps("description")}
                                    className={`w-full px-3 py-2 border rounded-md ${
                                        formik.touched.description && formik.errors.description
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="A Project to develop a new company website"
                                    rows={3}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <p className="text-sm text-red-500">
                                        {formik.errors.description}
                                    </p>
                                )}
                            </div>

                            {createError && (
                                <p className="text-sm text-red-600">{createError}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-2 rounded-md hover:bg-zinc-800 transition"
                            >
                                Create Project
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsList;
