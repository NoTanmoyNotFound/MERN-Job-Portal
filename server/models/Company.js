import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false }, // Add this field with a default value of false
});

const Company = mongoose.model("Company", companySchema);
export default Company;
