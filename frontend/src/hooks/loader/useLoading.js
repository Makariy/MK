import React, { useState } from "react";


const useLoading = (func) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loader = () => {
        try {
            return func().then(data => {
                setIsLoading(false);
                return data
            })
        }
        catch (e) {
            setError(e);
        }
    }
    return [loader, isLoading, error];
};

export default useLoading;