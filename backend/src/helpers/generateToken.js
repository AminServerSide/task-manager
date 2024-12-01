import jwt from "jsonwebtoken";

//use user id to generate token
const generateToken = (id) => {
  // token must be returned to the client
  return jwt.sign({ id }, "mysecretkey", {
    expiresIn: "30d",
  });
};

export default generateToken;
