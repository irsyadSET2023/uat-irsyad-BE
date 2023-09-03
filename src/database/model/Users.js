// Import necessary dependencies
import postgressConnection from "../connection";
import { DataTypes } from "sequelize";
import Organizations from "./Organizations";

// Define the Users model
const Users = postgressConnection.define(
  "Users",
  {
    // Model attributes are defined here
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

// Establish the one-to-many relationship

Users.belongsTo(Organizations, { foreignKey: "organization_id" });
Users.hasOne(Organizations, { foreignKey: "owner_id" });
export default Users;
