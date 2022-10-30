import { useState } from "react";
import {
  emailValidator,
  passwordValidator,
} from "../../validation/formValidators";

export const useLoginFormValidator = (formState) => {
  const errorStyle = {
    border: "1px solid red",
  };

  const [errors, setErrors] = useState({
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
  });

  const validateFormFields = ({
    formState,
    errors,
    field,
    submitValidation = false,
  }) => {
    let nextErrors = { ...errors };

    if (submitValidation) {
      nextErrors = Object.entries(nextErrors).reduce(
        (acc, [field, errorField]) => {
          acc[field] = {
            ...errorField,
            dirty: true,
          };
          return acc;
        },
        {}
      );
    }

    let isValid = true;

    const { name, email, password, confirmPassword, day, month, year } =
      formState;

    if (nextErrors.email.dirty && (field ? field == "email" : true)) {
      let errorMessage = emailValidator(email);
      nextErrors.email.error = !!errorMessage;
      nextErrors.email.message = errorMessage;
      nextErrors.email.style = errorMessage ? errorStyle : {};
      if (!!errorMessage) isValid = false;
    }

    if (nextErrors.password.dirty && (field ? field == "password" : true)) {
      let errorMessage = passwordValidator(password);
      nextErrors.password.error = !!errorMessage;
      nextErrors.password.message = errorMessage;
      nextErrors.password.style = errorMessage ? errorStyle : {};
      if (!!errorMessage) isValid = false;
    }

    setErrors(nextErrors);

    return {
      isValid,
      errors: nextErrors,
    };
  };

  const handleOnBlur = (e) => {
    let field = e.target.name;
    // if (errors[field].dirty) return;

    const updatedErrors = {
      ...errors,
      [field]: {
        ...errors[field],
        dirty: true,
      },
    };

    validateFormFields({ formState, errors: updatedErrors, field });
  };

  const handleOnChange = (e) => {
    let field = e.target.name;
    // if (errors[field].dirty) return;

    const updatedErrors = {
      ...errors,
      [field]: {
        ...errors[field],
        dirty: true,
      },
    };

    validateFormFields({ formState, errors: updatedErrors, field });
  };

  return {
    errors,
    validateFormFields,
    handleOnBlur,
    handleOnChange,
  };
};
