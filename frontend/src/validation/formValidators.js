const nameValidator = (name) => {
  if (!name || (name && !name.trim())) {
    return "Name is required *";
  }
  return "";
};

const emailValidator = (email) => {
  if (!email || (email && !email.trim())) {
    return "Email is required *";
  }
  if (!new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email)) {
    return "Invalid email *";
  }
  return "";
};

const passwordValidator = (password) => {
  let regex = new RegExp("[0-9]|[A-Z]");
  if (!password || (password && !password.trim())) {
    return "Password is required *";
  } else if (password.length < 8) {
    return "Password is less than 8 characters";
  } else if (!regex.test(password)) {
    return "Password should contain at least one uppercase(A, B or Z) letter and one number(1,2 or 9";
  }

  return "";
};

const confirmPasswordValidator = (confirmPassword, password) => {
  let regex = new RegExp("[0-9]|[A-Z]");
  if (!confirmPassword || (confirmPassword && !confirmPassword.trim())) {
    return "Password is required *";
  } else if (confirmPassword.length < 8) {
    return "Password is less than 8 characters";
  } else if (!regex.test(confirmPassword)) {
    return "Password should contain at least one uppercase(A, B or Z) letter and one number(1,2 or 9";
  } else if (confirmPassword !== password) {
    return "Passwords do not match";
  }
  return "";
};

const dateOfBirthValidator = (value) => {
  if (!value || (value && !value.trim())) {
    return "Required *";
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
