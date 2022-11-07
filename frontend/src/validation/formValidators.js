const nameValidator = (name) => {
  if (!name || (name && !name.trim())) {
    return "Name is required ";
  }
  return "";
};

const emailValidator = (email) => {
  if (!email || (email && !email.trim())) {
    return "Email is required ";
  }
  if (!new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email)) {
    return "Invalid email ";
  }
  return "";
};

const passwordValidator = (password) => {
  let uppercaseRegex = new RegExp("[A-Z]");
  let numberRegex = new RegExp("[0-9]");

  if (!password || (password && !password.trim())) {
    return "Password is required ";
  } else if (password.length < 8) {
    return "Password is less than 8 characters";
  } else if (!uppercaseRegex.test(password)) {
    return "Password must contain one uppercase letter";
  } else if (!numberRegex.test(password)) {
    return "Password must contain one number";
  }

  return "";
};

const confirmPasswordValidator = (confirmPassword, password) => {
  let uppercaseRegex = new RegExp("[A-Z]");
  let numberRegex = new RegExp("[0-9]");

  if (!confirmPassword || (confirmPassword && !confirmPassword.trim())) {
    return "Password is required ";
  } else if (confirmPassword.length < 8) {
    return "Password is less than 8 characters";
  } else if (!uppercaseRegex.test(password)) {
    return "Password must contain one uppercase letter";
  } else if (!numberRegex.test(password)) {
    return "Password must contain one number";
  } else if (confirmPassword !== password) {
    return "Passwords do not match";
  }
  return "";
};

const dateOfBirthValidator = (value) => {
  if (!value || (value && !value.trim())) {
    return "Required ";
  }

  return "";
};

export {
  nameValidator,
  emailValidator,
  passwordValidator,
  dateOfBirthValidator,
  confirmPasswordValidator,
};
