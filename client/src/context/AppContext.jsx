import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ""); // Ensure no trailing slash

    const { user } = useUser();
    const { getToken } = useAuth();

    const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
    const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken") || null);
    const [companyData, setCompanyData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userApplications, setUserApplications] = useState([]);

    // Save companyToken when changed
    useEffect(() => {
        if (companyToken) {
            localStorage.setItem("companyToken", companyToken);
        } else {
            localStorage.removeItem("companyToken");
        }
    }, [companyToken]);

    // Function to fetch jobs data
    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/jobs`);
            if (data.success) {
                setJobs(data.jobs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to fetch company data
    const fetchCompanyData = async () => {
        try {
            if (!companyToken) {
                console.log("No companyToken found, skipping fetch.");
                return;
            }

            console.log("Fetching Company Data with Token:", companyToken);

            const { data } = await axios.get(`${backendUrl}/api/company/company`, {
                headers: { Authorization: `Bearer ${companyToken}` },
            });

            if (data.success) {
                setCompanyData(data.company);
                console.log("Company Data:", data.company);
            } else {
                toast.error(data.message || "Error fetching company data");
            }
        } catch (error) {
            console.error("Error fetching company data:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to fetch company data");
        }
    };

    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const token = await getToken();
            if (!token) throw new Error("No Auth Token Found!");

            const { data } = await axios.get(`${backendUrl}/api/users/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch user data");
        }
    };

    // Function to fetch user applications
    const fetchUserApplications = async () => {
        try {
            const token = await getToken();
            if (!token) throw new Error("No Auth Token Found!");

            const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUserApplications(data.applications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchCompanyData(); // Fetch company data on app load if token exists
    }, []);

    useEffect(() => {
        console.log("companyToken changed:", companyToken);
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken]);

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchUserApplications();
        }
    }, [user]);

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData, setUserData,
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
