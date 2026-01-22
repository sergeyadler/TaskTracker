import { useFormik } from "formik";
import * as Yup from "yup";
import {register, selectRegistrationError, selectRegistrationSuccess} from "../slice/authSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import type {UserRegistrationDto} from "../types";

const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const registrationError = useAppSelector(selectRegistrationError);
  const registrationSuccess = useAppSelector(selectRegistrationSuccess);
  const [isSubmitting,  setIsSubmitting] = useState(false);
  const [redirectCancelled, setRedirectCancelled] = useState(false);
  const timerRef = useRef<number | null>(null);


  //Redirect to login page after successfull registration
  useEffect(() =>{
      if (registrationSuccess && !redirectCancelled){
          timerRef.current= setTimeout(() => {
              navigate("/login");
          }, 15000); //Redirect after 15 seconds
          return () => {
              if (timerRef.current){
                  clearTimeout(timerRef.current);
              }
          };
      }
      if(!registrationSuccess){
          setRedirectCancelled(false);
      }
  }, [registrationSuccess, redirectCancelled, navigate]);
  const cancelRedirect = ()=> {
      if (timerRef.current){
          clearTimeout(timerRef.current);
          timerRef.current = null;
      }
      setRedirectCancelled(true);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword:"",
      firstName: "",
      lastName: "",
    },
    validationSchema: Yup.object({
        firstName: Yup.string()
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must not exceed 50 characters")
            .matches(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes")
            .required("First name is required"),
        lastName: Yup.string()
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name must not exceed 50 characters")
            .matches(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes")
            .required("Last name is required"),
      email: Yup.string()
          .email("Please enter a valid email address")
          .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email format is invalid")
          .max(255, "Email must not exceed 255 characters")
         .required("Email is required"),
      password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .max(128, "Password must not exceed 128 characters")
          .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
          .matches(/[a-z]/, "Password must contain at least one lowercase letter")
          .matches(/[0-9]/, "Password must contain at least one number")
          .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
         .required("Password is required"),
    }),
    onSubmit: async (values:{email: string; password: string; confirmPassword: string; firstName: string; lastName: string}) => {
        setIsSubmitting(true);
      try {
          // Exclude confirmPassword from registration payload
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { confirmPassword: _confirmPassword, ...registrationData } = values;
          await dispatch(register(registrationData as UserRegistrationDto));
      }finally {
          setIsSubmitting(false);
      }
    },
  });
  const resetForm = () =>{
      formik.resetForm();
      setRedirectCancelled(false);
  };

  return (
      <div className="mx-auto max-w-md w-full space-y-6 p-6 sm:p-8 rounded-lg border bg-white shadow-lg mt-4 sm:mt-10">
          <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                  Create an account
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground text-gray-600">
                  Enter your information to create an account
              </p>
              {registrationError && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border-2 border-red-200 shadow-sm">
                      <div className="font-semibold mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Registration Error
                      </div>
                      <div className="mb-2">{registrationError}</div>
                      <div className="mt-2 text-xs text-red-600">
                          Please check your data and try again.
                      </div>
                  </div>
              )}
              {registrationSuccess && (
                  <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border-2 border-green-200 shadow-sm">
                      <div className="font-semibold mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Registration Successful!
                      </div>
                      <div className="mb-3">{registrationSuccess}</div>
                      <p className="mt-2 text-xs sm:text-sm text-green-600 mb-2">
                          Please check your email and click the confirmation link to activate your account.
                      </p>
                      <p className="mt-2 text-xs sm:text-sm text-green-600 mb-3">
                          After confirming your email, you can sign in.
                      </p>
                      {!redirectCancelled && (
                          <p className="mt-2 text-xs sm:text-sm text-green-600 mb-3">
                              Redirecting to login page in a few seconds....
                          </p>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <button
                              type="button"
                              onClick={() => navigate("/login")}
                              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                              Go to Sign In
                          </button>
                          {!redirectCancelled && (
                              <button
                                  type="button"
                                  onClick={cancelRedirect}
                                  className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 border border-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                              >
                                  Stay on page
                              </button>
                          )}
                          <button
                              type="button"
                              onClick={resetForm}
                              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 border border-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                              Register Another Account
                          </button>
                      </div>
                  </div>
              )}
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-5">
              {/* First Name and Last Name in a row on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name Field */}
                  <div className="space-y-2">
                      <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700"
                      >
                          First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                          id="firstName"
                          type="text"
                          {...formik.getFieldProps("firstName")}
                          className={`w-full px-4 py-2.5 text-sm sm:text-base border rounded-lg shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formik.touched.firstName && formik.errors.firstName
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : formik.touched.firstName && !formik.errors.firstName
                                      ? "border-green-500 focus:ring-green-500 focus:border-green-500"
                                      : "border-gray-300"
                          }`}
                          placeholder="John"
                          autoComplete="given-name"
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                          <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {formik.errors.firstName}
                          </p>
                      )}
                  </div>

                  {/* Last Name Field */}
                  <div className="space-y-2">
                      <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700"
                      >
                          Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                          id="lastName"
                          type="text"
                          {...formik.getFieldProps("lastName")}
                          className={`w-full px-4 py-2.5 text-sm sm:text-base border rounded-lg shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formik.touched.lastName && formik.errors.lastName
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : formik.touched.lastName && !formik.errors.lastName
                                      ? "border-green-500 focus:ring-green-500 focus:border-green-500"
                                      : "border-gray-300"
                          }`}
                          placeholder="Doe"
                          autoComplete="family-name"
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                          <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {formik.errors.lastName}
                          </p>
                      )}
                  </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                  <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                  >
                      Email <span className="text-red-500">*</span>
                  </label>
                  <input
                      id="email"
                      type="email"
                      {...formik.getFieldProps("email")}
                      className={`w-full px-4 py-2.5 text-sm sm:text-base border rounded-lg shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formik.touched.email && formik.errors.email
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : formik.touched.email && !formik.errors.email
                                  ? "border-green-500 focus:ring-green-500 focus:border-green-500"
                                  : "border-gray-300"
                      }`}
                      placeholder="you@example.com"
                      autoComplete="email"
                  />
                  {formik.touched.email && formik.errors.email && (
                      <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {formik.errors.email}
                      </p>
                  )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                  <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                  >
                      Password <span className="text-red-500">*</span>
                  </label>
                  <input
                      id="password"
                      type="password"
                      {...formik.getFieldProps("password")}
                      className={`w-full px-4 py-2.5 text-sm sm:text-base border rounded-lg shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formik.touched.password && formik.errors.password
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : formik.touched.password && !formik.errors.password
                                  ? "border-green-500 focus:ring-green-500 focus:border-green-500"
                                  : "border-gray-300"
                      }`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                  />
                  {formik.touched.password && formik.errors.password && (
                      <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {formik.errors.password}
                      </p>
                  )}
                  {!formik.errors.password && formik.touched.password && (
                      <p className="text-xs text-gray-500 mt-1">
                          Must contain: uppercase, lowercase, number, and special character
                      </p>
                  )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                  <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                  >
                      Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                      id="confirmPassword"
                      type="password"
                      {...formik.getFieldProps("confirmPassword")}
                      className={`w-full px-4 py-2.5 text-sm sm:text-base border rounded-lg shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formik.touched.confirmPassword && formik.errors.confirmPassword
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : formik.touched.confirmPassword && !formik.errors.confirmPassword
                                  ? "border-green-500 focus:ring-green-500 focus:border-green-500"
                                  : "border-gray-300"
                      }`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {formik.errors.confirmPassword}
                      </p>
                  )}
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={isSubmitting || !formik.isValid}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 disabled:transform-none disabled:shadow-md"
              >
                  {isSubmitting ?(
                      <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registering...
                      </>
                  ) :(
                      <>
                          <span>Create Account</span>
                          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                      </>
                  )}
              </button>

              {/* Required fields note */}
              <p className="text-xs text-gray-500 text-center mt-2">
                  <span className="text-red-500">*</span> Required fields
              </p>
          </form>
      </div>
  );
};

export default RegistrationForm;
