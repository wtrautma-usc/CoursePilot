"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function GoodleSignInBtn() {
    const handleSignIn = async () =>{
        try{
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log("User signed in:", result.user);
            alert(`Welcome, ${result.user.displayName}`);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };
    return (
        <button
        onClick={handleSignIn}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
        Sign in with Google
        </button>
    );
};