export const login = async (email, password) => {
    // Simulate API call
    console.log("Logging in with:", email);
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = { id: 1, name: "John Doe", email };
            localStorage.setItem("user", JSON.stringify(user));
            resolve(user);
        }, 1000);
    });
};

export const register = async (userData) => {
    // Simulate API call
    console.log("Registering user:", userData);
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = { id: 2, ...userData };
            localStorage.setItem("user", JSON.stringify(user));
            resolve(user);
        }, 1500);
    });
};

export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    return null;
};
