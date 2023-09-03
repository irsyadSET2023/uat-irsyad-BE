import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import config from "../../config";
import postgressConnection from "../../database/connection";
import Users from "../../database/model/Users";

async function registerUser(req, res) {
  const { username, email, password, first_name, last_name } = req.body;
  let saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    const createdUser = await Users.create({
      userName: username,
      email: email,
      password: hashedPassword,
      firstName: first_name,
      lastName: last_name,
    });
    res.status(200).json({ message: `Account Created`, data: createdUser });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    return;
  }
}

async function loginUser(req, res) {
  const { identifier, password } = req.body;
  const data = await Users.findOne({
    where: {
      [Op.or]: [{ userName: identifier }, { email: identifier }],
    },
  });

  const user = data.dataValues;
  console.log(user);

  const generatAccessToken = (userData) => {
    return jwt.sign(userData, config.jwtSecretToken);
  };

  bcrypt.compare(password, user.password, (error, bcryptRes) => {
    if (bcryptRes) {
      console.log("User Id", user.id);
      req.token = user.id;
      console.log("Token", req.token);

      const token = generatAccessToken({
        id: user.id,
        username: user.userName,
        email: user.email,
        isOwner: data.isOwner,
        roles: data.roles,
      });
      const serverRes = {
        message: "Login successful",
        data: { id: user.id, username: user.userName, email: user.email },
        jwt: token,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "Login Unsuccesful",
        error: "Invalid credential",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });
}

async function updateUser(req, res) {
  const userId = req.user.id;
  const body = req.body;
  const updatedColumns = {};
  // Construct the SET clause for the SQL query
  Object.entries(body).forEach(([key, value]) => {
    if (key === "password") {
      let saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(value, saltRounds);
      updatedColumns[key] = hashedPassword;
    } else if (key === "username") {
      updatedColumns["userName"] = value;
    } else {
      updatedColumns[key] = value;
    }
  });

  try {
    const updatedUser = await Users.update(updatedColumns, {
      where: { id: userId },
    });
    res.status(200).json({ message: `User ${userId} is updated`, updatedUser });
    return;
  } catch (error) {
    res.status(500).json(error);
  }
}

function logoutUser(req, res) {
  res.status(200).json({ message: "Successfully logout" });
}

async function deactivateAccount(req, res) {
  const userId = req.user.id;

  try {
    await postgressConnection.transaction(async (t) => {
      const deletedUser = await Users.destroy({
        where: { id: userId },
        transaction: t,
      });
      res
        .status(200)
        .json({ message: `Your Account is deactivated`, data: deletedUser });
      return;
    });
  } catch (error) {
    res.status(500).json(error);
    return;
  }
}

const authController = {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deactivateAccount,
};

export default authController;
