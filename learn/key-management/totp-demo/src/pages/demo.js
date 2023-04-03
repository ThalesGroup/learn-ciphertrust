// Element with a form that has an input field for the OTP and a button to submit the OTP to the server (all in tailwind)
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { createKey, exportKey } from "../utils/cryptoOps";
import axios from "axios";

export default function OTP() {
    return (
        <>
        <Head>
            <title>CipherTrust Time-based OTP Demo</title>
        </Head>
        <div className="flex items-center h-screen w-full bg-gray-200">
            <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md m-auto">
                <h1 className="text-3xl font-bold text-center mb-6">Demo Login</h1>
                <div className="flex md:flex-row flex-col justify-center gap-4">
                    <button className="bg-blue-500 p-2 rounded-md text-white">Login</button>
                    <Link href="/signup"><button className="bg-green-600 p-2 rounded-md text-white">Sign Up</button></Link>
                </div>
            </form>
        </div>
        </>

    );
}