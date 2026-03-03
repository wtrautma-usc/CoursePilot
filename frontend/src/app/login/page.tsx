"use client";

import GoogleSignInButton from "@/components/GoogleSignInBtn";

import Image from "next/image";

export default function Login() {
    return(
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="relative hidden md:block">
                <Image
                    src="/Login.png"
                    alt="Login Background"
                    fill
                    className="object-cover"
                />
            </div>
            <div className=" flex items-center justify-center bg-white px-8 py-12">
                <div className="w-full max-w-md space-y-8">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Welcome to CoursePilot! Please sign in to continue.
                    </h2>
                    <div className="space-y-5">
                        <div className="space-y-5">
                            <label className="block text-sm font-semibold text-gray-600">
                                Email
                            </label>
                            <input type="email" placeholder="Enter your email"
                            className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-600">Password</label>
                            <input type="password" placeholder="Enter your password"
                            className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <button
                        className="w-full rounded-md bg-[#20A39E] py-3 text-white font-semibold hover:opacity-90 transition"
                        >
                            Sign In
                        </button>
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs text-gray-400">OR</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>
                            <GoogleSignInButton />
                    </div>
                </div>
            </div>
        </div>
    );
}