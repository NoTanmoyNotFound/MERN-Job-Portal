import express from 'express'
import { ChangeJobApplicationsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyControllers.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()

//Register a company 
router.post('/register',upload.single('image'), registerCompany)


//Company login
router.post('/login', loginCompany)

//Get Company data
router.get('/company', protectCompany, getCompanyData)

//Post a job
router.post('/post-job', protectCompany, postJob)

//Get aplicants data of company
router.get('/applicants', protectCompany, getCompanyJobApplicants)

//Get Company JOb list
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

//Change Applicants status
router.post('/change-status', protectCompany, ChangeJobApplicationsStatus)

//Change Applicanta Visibiliity
router.post('/change-visibility', protectCompany, changeVisibility)

export default router;