import fs from "fs";
import productModel from "../../models/product";
import dbConnection from "../../config/dbConnection";

void dbConnection();

const products = JSON.parse(fs.readFileSync("./product.json", "utf-8"));

const insertData = async (): Promise<void> => {
  try {
    await productModel.create(products);
    console.log("Data Inserted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async (): Promise<void> => {
  try {
    await productModel.deleteMany();
    console.log("Data Destroyed");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  void insertData();
} else if (process.argv[2] === "-d") {
  void destroyData();
}
