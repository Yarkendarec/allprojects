import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ token, children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await fetch("/api/auth/check", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status !== 200) {
                    navigate("/signin");
                }
            } catch (error) {
                console.error("Error checking token:", error);
                navigate("/signin");
            }
        };

        if (token) {
            checkToken();
        } else {
            navigate("/signin");
        }
    }, [token, navigate]);

    return <>{children}</>;
};

export default Protected;