import { useState } from "react";
import {
  dateOfBirthValidator,
  emailValidator,
  nameValidator,
  passwordValidator,
  confirmPasswordValidator,
} from "../../validation/formValidators";

export const useSignupForm = (formState) => {
  const errorStyle = {
    border: "1px solid red",
  };

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

    if (nextErrors.name.dirty && (field ? field == "name" : true)) {
      let errorMessage = nameValidator(name);
      nextErrors.name.error = !!errorMessage;
      nextErrors.name.message = errorMessage;
      nextErrors.name.style = errorMessage ? errorStyle : {};
      if (!!errorMessage) isValid = false;
    }

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

    if (
      nextErrors.confirmPassword.dirty &&
      (field ? field == "confirmPassword" : true)
    ) {
      let errorMessage = confirmPasswordValidator(confirmPassword, password);
      nextErrors.confirmPassword.error = !!errorMessage;
      nextErrors.confirmPassword.message = errorMessage;
      nextErrors.confirmPassword.style = errorMessage ? errorStyle : {};
      if (!!errorMessage) isValid = false;
    }

    if (nextErrors.day.dirty && (field ? field == "day" : true)) {
      let errorMessage = dateOfBirthValidator(day);
      nextErrors.day.error = !!errorMessage;
      nextErrors.day.message = errorMessage;
      nextErrors.day.style = errorMessage ? errorStyle : {};
      if (!!errorMessage) isValid = false;
    }

    if (nextErrors.month.dirty && (field ? field == "month" : true)) {
      let errorMessage = dateOfBirthValidator(month);
      nextErrors.month.error = !!errorMessage;
      nextErrors.month.message = errorMessage;
      nextErrors.month.style = errorMessage ? errorStyle : {};
      if (!!errorMessage) isValid = false;
    }

    if (nextErrors.year.dirty && (field ? field == "year" : true)) {
      let errorMessage = dateOfBirthValidator(year);
      nextErrors.year.error = !!errorMessage;
      nextErrors.year.message = errorMessage;
      nextErrors.year.style = errorMessage ? errorStyle : {};
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

  return {
    errors,
    validateFormFields,
    handleOnBlur,
  };
};
