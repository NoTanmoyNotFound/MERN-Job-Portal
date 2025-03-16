import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ""); // Ensure no trailing slash

    const {user} = useUser()
    const{getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    });

    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
    const [companyToken, setCompanyToken] = useState(null);
    const [companyData, setCompanyData] = useState(null);

    const [userData,setUserData] = useState(null)
    const [userApplications,setUserApplications] = useState([])


    //

    // Function to fetch jobs data
    const fetchJobs = async () => {
        try {
            const {data} = await axios.get(backendUrl+'/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                console.log(data.jobs)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    };

    // Function to fetch company data
    const fetchCompanyData = async () => {
        try {
            if (!companyToken) return;
    
            const apiUrl = `${backendUrl}/api/company/company`.replace(/([^:]\/)\/+/g, "$1"); // Ensure proper URL format
    
            const { data } = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${companyToken}` }
            });
    
            if (data.success) {
                setCompanyData(data.company);
                console.log("Company Data:", data);
            } else {
                toast.error(data.message || "Error fetching company data");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch company data");
        }
    };
    

    // Function to fetch user data
    const fetchUserData = async()=>{
        try {
            
            const token = await getToken()

            const {data} = await axios.get(backendUrl+'/api/users/user',
            {headers:{Authorization:`Bearer ${token}`}})

            if (data.success) {
                setUserData(data.user)
            }else(
                toast.error(data.message)
            )

        } catch (error) {
            toast.error(error.message)
        }
    }

   // Function to fetch users applied applications data
   const fetchUserApplications = async()=>{
    try {
        const token = await getToken()
        const {data} = await axios.get(backendUrl+'/api/users/applications',
            {headers:{Authorization : `Bearer ${token}`}}
        )

        if (data.success) {
            setUserApplications(data.applications)
        } else{
            toast.error(data.message)
        }

    } catch (error) {
      toast.error(error.message)  
    }
   } 

    useEffect(() => {
        fetchJobs();

        const storedCompanyToken = localStorage.getItem('companyToken');
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken);
        }
    }, []);

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken]);


    useEffect(()=>{
        if (user) {
            fetchUserData()
            fetchUserApplications()
        }
    },[user])

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData,setUserData,
        userApplications, setUserApplications,
        fetchUserData,
        fetchUserApplications,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
