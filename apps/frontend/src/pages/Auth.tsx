import { loginReq, regiserReq } from "@/api/authApi";
import Loader from "@/components/Loader";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";


export default function Auth() {
    type AuthMode = "Register" | "Login";
    const [authMode, setAuthMode] = useState<AuthMode>("Login");
    const [loading, setLoading] = useState<boolean>(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwrodRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function handleSubmit() {
        const username = usernameRef.current?.value;
        const password = passwrodRef.current?.value;

        if (!username || !password) {
            alert("Please fill in all fields");
            return;
        }
        //console.log(username, password);

        try {
            setLoading(true);
            if(authMode === "Register") {
                await regiserReq(username, password);
                alert("Registration successful! Please sign in.");
                setAuthMode("Login");
                // Clear input fields
                if (usernameRef.current) usernameRef.current.value = "";
                if (passwrodRef.current) passwrodRef.current.value = "";
            } else if(authMode === "Login") {
                await loginReq(username, password);
                navigate("/home")
                alert("Login successful!");
            }
        } catch (error) {
            console.error("Authentication error:", error);
            alert(`Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    }

    if(loading) {
        return <Loader />
    }

    return (
        <div className="w-full min-h-screen bg-[#070A13] flex place-items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mt-8 md:mt-20">
                    {authMode === "Register" ?
                        <h2 className="text-2xl md:text-3xl font-bold text-center">Sign up for free</h2> :
                        <h2 className="text-2xl md:text-3xl font-bold text-center">Welcome back</h2>
                    }
                    {authMode === "Register" ?
                        <p className="text-[#939DB8] text-sm pt-3 text-center">Already have an account? 
                            <span className="text-[#7C87F7] cursor-pointer pl-1" onClick={() => setAuthMode("Login")}>
                                Sign in
                            </span>.
                        </p> :
                        <p className="text-[#939DB8] text-sm pt-3 text-center">First time here? 
                            <span className="text-[#7C87F7] cursor-pointer pl-1" onClick={() => setAuthMode("Register")}>
                                Sign up for free
                            </span>.
                        </p>
                    }
                    {/*take input username & password*/}
                    <div className="w-full flex flex-col gap-1 mt-5">
                        <p className="text-[12px] text-[#939DB8]">Username</p>
                        <input ref={usernameRef} required type="text" placeholder="Your username" className="w-full py-3 pl-4 pr-4 border bg-[#181B27] rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-zinc-500 focus:ring-offset-0 active:scale-95" />
                    </div>
                    <div className="w-full flex flex-col gap-1 mt-5">
                        <p className="text-[12px] text-[#939DB8]">Password</p>
                        <input ref={passwrodRef} required type="password" placeholder="Your password" className="w-full py-3 pl-4 pr-4 border bg-[#181B27] rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-zinc-500 focus:ring-offset-0 active:scale-95" />
                    </div>
                    <button type="button" className="mt-8 bg-[#5b63d3] w-full py-3 rounded-xl hover:bg-[#4449A9] cursor-pointer text-sm" onClick={handleSubmit}>
                        {authMode === "Register" ? "Register" : "Login"}
                    </button>
                </div>
                <p className="text-xs text-center px-4 md:px-10 text-[#6f778c] mt-8 md:mt-30">You acknowledge that you read, and agree to our <span className="text-white">Terms of Service</span> and our <span className="text-white">Privacy Policy</span>.</p>
            </div>
        </div>
    )
}