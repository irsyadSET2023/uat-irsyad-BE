import postgressConnection from "./connection";
import Organizations from "./model/Organizations";
import Users from "./model/Users";
async function syncModels() {
  await postgressConnection.authenticate();
  await Users.sync({ alter: true });
  await Organizations.sync({ alter: true });
}

async function dbInit() {
  try {
    console.debug("Connection to the database");
    await syncModels();
    console.debug("Connected to the database");
  } catch (error) {
    console.error("Failed to connect");
    process.exit(1);
  }
}

export default dbInit;
