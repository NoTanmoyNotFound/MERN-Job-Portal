import express from 'express'
import { ChangeJobApplicationsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyControllers.js'
import upload from '../config/multer.js'

const router = express.Router()

//Register a company 
router.post('/register',upload.single('image'), registerCompany)


//Company login
router.post('/login', loginCompany)

//Get Company data
router.get('/company',getCompanyData)

//Post a job
router.post('/post-job',postJob)

//Get aplicants data of company
router.get('/applicants',getCompanyJobApplicants)

//Get Company JOb list
router.get('/list-jobs',getCompanyPostedJobs)

//Change Applicants status
router.post('/change-status',ChangeJobApplicationsStatus)

//Change Applicanta Visibiliity
router.post('/change-visibility',changeVisibility)

export default router;