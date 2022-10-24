const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {}, function (err) {
    if (err) {
      console.log(err);
      process.exit();
    } else {
      console.log(`connected to mongoDB ${mongoose.connection.host}`);
    }
  });
};

module.exports = connectToMongoDB;
