import Company from "../models/Company.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplications.js";

//Register a new company
export const registerCompany = async (req, res) => {

    const { name, email, password } = req.body

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {

        const companyExists = await Company.findOne({ email })

        if (companyExists) {
            return res.json({ success: false, message: 'Company already registered' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

//Company Login
export const loginCompany = async (req, res) => {

    const { email, password } = req.body

    try {

        const company = await Company.findOne({ email })

        if (await bcrypt.compare(password, company.password)) {

            res.json({

                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })
        }
        else {
            res.json({ success: false, message: 'Invalid email or passowrd' })
        }

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

//Get Company data
import jwt from 'jsonwebtoken'; // Ensure JWT is imported

export const getCompanyData = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const company = await Company.findById(decoded.id).select("-password");

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        // ✅ Check if the company is verified before allowing access
        if (!company.isVerified) {
            return res.status(403).json({ success: false, message: "Your account is not verified. Please contact support." });
        }

        res.json({ success: true, company });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};



//Post a new Job
export const postJob = async (req, res) => {

    const { title, description, location, salary, level, category } = req.body

    const companyId = req.company._id

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()

        res.json({ success: true, newJob })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

//Get Company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id

        //Find job applications for the user and populate related data
        const applications = await JobApplication.find({ companyId })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location category level salary')
            .exec()

        return res.json({ success: true, applications })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {

    try {

        const companyId = req.company._id

        const jobs = await Job.find({ companyId })

        // Adding No. of aplicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({ jobId: job._id });
            return { ...job.toObject(), applicants: applicants.length }
        }))

        res.json({ success: true, jobsData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

//Change Job Application Status
export const ChangeJobApplicationsStatus = async (req, res) => {

    try {
        const { id, status } = req.body

        // find jon application data and update status
        await JobApplication.findOneAndUpdate({ _id: id }, { status })

        res.json({ success: true, message: 'Status Changed' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

//Change JOb Visibility 
export const changeVisibility = async (req, res) => {
    try {

        const { id } = req.body
        const companyId = req.company._id

        const job = await Job.findById(id)

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible
        }

        await job.save()

        res.json({ success: true, job })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}