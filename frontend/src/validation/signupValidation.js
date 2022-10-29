const nameValidator = (name) => {
  if (!name || (name && !name.trim())) {
    return "Name is required *";
  }
};

const emailValidator = (name) => {
  if (!name || (name && !name.trim())) {
    return "Email is required *";
  }
  //   if ()
};

export default {
  nameValidator,
};
