import {useState} from "react";
import "./auth.scss"
import {useAuth} from "../../context/AuthContext.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Disclaimer} from "../../ui/Disclaimer.jsx";
import LoadingIcon from "../../ui/LoadingIcon/LoadingIcon.jsx";

//lOGIN FORM
const Login = ({onSubmit, error}) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        onSubmit(formData).finally(() => setLoading(false));
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <Disclaimer
                size={"15px"} color={"#ff0000"}
            />
            <h2>Login</h2>

            {error && <div className="error-message">{error}</div>}

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <button type="submit" disabled={loading}>
                {loading ? <LoadingIcon/> : 'Login'}
            </button>
        </form>
    );
};


//SIGNUP FORM
const Signup = ({onSubmit, error}) => {

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        setLocalError("");
        if (formData.password !== formData.confirmPassword) {
            setLocalError("Passwords do not match");
            setLoading(false)
            return;
        }
        const submissionData = {...formData};
        delete submissionData.confirmPassword;
        onSubmit(submissionData).finally(() => setLoading(false));
    };

    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <Disclaimer message={"*Please refrain from using sensitive information as this is more for proof of" +
                " concept."} size={"15px"} color={"white"}
            />
            <h2>Sign Up</h2>

            {(error || localError) && <div className="error-message">{error || localError}</div>}

            <div className={"name-group"}>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />

            <button type="submit" disabled={loading}>
                {loading ? <LoadingIcon/> : "Create Account"}
            </button>
        </form>
    );
};


//AUTH PAGE
const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const apiUrl = import.meta.env.VITE_AUTH_API
    const {login} = useAuth();
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const ref = params.get("return") ? decodeURIComponent(params.get("return")) : "/";


    const swap = () => {
        setIsLogin(prev => !prev);
        setError("");
    };

    const handleLogin = async (data) => {
        setError("");
        try {
            const response = await fetch(`${apiUrl}/login?email=${data.email}&password=${data.password}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const result = await response.json();
                if (result.token) {
                    login(result.user, result.token);
                    navigate(ref)
                } else {
                    setError("Invalid credentials");
                }
            } else {
                setError("Login failed");
            }
        } catch (error) {
            console.error(error);
            setError("An unexpected error occurred");
        }
    };

    const handleSignup = async (data) => {
        setError("");
        try {
            const response = await fetch(`${apiUrl}/signup`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const result = await response.json();
                if (result.token) {
                    login(result.user, result.token);
                    navigate(ref);
                } else {
                    setIsLogin(true);
                    setError("Account created, please login");
                }
            } else {
                setError("Signup failed");
            }
        } catch (error) {
            console.error(error);
            setError("An unexpected error occurred");
        }
    };

    return (
        <div className="auth-page">
            <div className={"auth-page-container"}>

                {isLogin ? (
                    <Login onSubmit={handleLogin} error={error}/>
                ) : (
                    <Signup onSubmit={handleSignup} error={error}/>
                )}

                <button type="button" onClick={swap}>
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
            </div>

        </div>
    );
};

export {Auth};