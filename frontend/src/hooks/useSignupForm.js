import { useState } from "react";

const useSignupForm = ({ formState }) => {
  const [errors, setErrors] = useState({
    name: {
      dirty: false,
      error: false,
      message: "",
      style: {},
    },
    email: {
      dirty: false,
      error: false,
      message: "",
      style: {},
    },
    password: {
      dirty: false,
      error: false,
      message: "",
      style: {},
    },
    confirmPassword: {
      dirty: false,
      error: false,
      message: "",
      style: {},
    },
    day: {
      dirty: false,
      error: false,
      message: "",
      style: {},
    },
    month: {
      dirty: false,
      error: false,
      message: "",
      style: {},
    },
    year: {
      dirty: false,
      error: false,
      message: "",
      style: {},
    },
  });

  const validateFormFields = ({}) => {};

  const handleOnBlur = (field) => {};

  return {
    errors,
    validateFormFields,
    handleOnBlur,
  };
};
