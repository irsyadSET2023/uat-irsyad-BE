import postgressConnection from "../connection";
import { DataTypes } from "sequelize";
const Organizations = postgressConnection.define(
  "Organizations",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    // Other model options go here
    timestamp: true,
    paranoid: true,
    underscored: true,
  }
);

export default Organizations;
