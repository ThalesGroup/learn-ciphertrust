import Image from "next/image";
import { useState } from "react";
import { authenticator } from '@otplib/preset-default';
import qrcode from 'qrcode';
import { keyEncoder, keyDecoder } from '@otplib/plugin-thirty-two';
import crypto from 'crypto';
import { createKey } from "../utils/keyops";
import axios from 'axios';
import Head from 'next/head';

// Signup page with a username and password input box in nextjs and tailwindcss
export default  function Signup() {
    const [signupState, setSignupState] = useState(false);
    const [userid, setUserid] = useState('');
    const [qrcodeImageURL, setQrcodeImageURL] = useState('');
    const [secret, setSecret] = useState('');
    const [otp, setOTP] = useState('');
    const [verifyState, setVerifyState] = useState(null);
    authenticator.options = {
        keyEncoder: keyEncoder,
        keyDecoder: keyDecoder,
    }

    const keyRequest = async (userid) => {
        // Create a JWT first
        let jwt = await axios.post(
            `/api/get-jwt`,
        )
        if (jwt.status !== 200) {
            console.error("Error creating JWT: ", jwt.data);
        } else {
            jwt = jwt.data;

            // For demo purposes I'm creating a random key identifier with the user's id and a random 4 characters
            let uuid = crypto.randomBytes(16).toString('hex').slice(0,4);
            const randomkeyId = `${userid}-${uuid}`;
            let key = await createKey(randomkeyId, jwt);

            if (key == false) {

                console.error("Error creating key");
            } else {
                console.log("Key created successfully");
                return {
                    key: key,
                    keyId: randomkeyId
                };
            }
        }
    }

    // Function to create otp key, and get qr code
    const createOTP = async (userid) => {
        let keyResponse = await keyRequest(userid);
        const key = authenticator.encode(keyResponse.key);
        const userkeyid = keyResponse.keyId;
        setUserid(userkeyid);
        setSecret(key);
        const otpauth = authenticator.keyuri(userkeyid, 'ciphertrust-demo', key);

        qrcode.toDataURL(otpauth, (err, imageUrl) => {
            if (err) {
                console.error('Error with QR');
                return;
            }
            setQrcodeImageURL(imageUrl);
        });
    }

    return (
        <>
            <Head>
                <title>CipherTrust Time-based OTP Demo</title>
            </Head>
            <div className="flex items-center h-screen w-full bg-gray-200">
                {signupState == false ? (
                    <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md m-auto">
                        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
                        <div className="flex flex-col mb-4">
                            <label className="mb-2 text-lg text-gray-400" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="border rounded-lg px-3 py-2 text-gray-400"
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username"
                                disabled={true}
                            />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="mb-2 text-lg text-gray-400" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="border rounded-lg px-3 py-2 text-gray-400"
                                type="password"
                                name="password"
                                id="password"
                                disabled={true}
                                placeholder="Password"
                            />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="mb-2 text-lg text-gray-400" htmlFor="password">
                                Confirm Password
                            </label>
                            <input
                                className="border rounded-lg px-3 py-2 text-gray-400"
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                disabled={true}
                            />

                            <p className="mb-2 text-lg text-gray-600 text-center">Ideally you&apos;d have your own authentication system above, but for the purposes of this demo let&apos;s just signup with a demo ID. The goal of this is to demo the multi-factor authentication OTP features.</p>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="mb-2 text-lg text-gray-600" htmlFor="uid">
                                Demo ID
                            </label>
                            <input
                                className="border rounded-lg px-3 py-2 text-gray-600"
                                type="text"
                                name="uid"
                                id="uid"
                                required={true}
                                onChange={(e) => {
                                    setUserid(e.target.value);
                                }}
                                placeholder="Enter a Demo ID"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button className="bg-blue-500 p-2 rounded-md text-white" onClick={() => {
                                setSignupState(true);
                                createOTP(userid);
                            }}>Sign Up</button>
                        </div>
                    </form>
                ) : (

                    <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md m-auto">
                        {/* Display QR code and an interactive animation to ask people to scan it with their 2fa app. */}
                        <p className="text-3xl font-bold text-center mb-6">Scan the QR code with your 2FA app (Ex - Google Authenticator, Authy, or any other)</p>
                        <Image src={qrcodeImageURL} className="mx-auto" alt="QR Code" width={200} height={200} />
                        {qrcodeImageURL != '' ? (
                            // Text box to enter OTP
                            <div className="flex flex-col mb-4">
                                <label className="mb-2 text-lg text-gray-600" htmlFor="otp">
                                    OTP
                                </label>
                                <input
                                    className="border rounded-lg px-3 py-2 text-gray-600"
                                    type="text"
                                    name="otp"
                                    id="otp"
                                    onChange={(e) => {
                                        setOTP(e.target.value);
                                    }}
                                    required={true}
                                    placeholder="Enter OTP"
                                />
                                {/* Verify OTP Button */}
                                <div className="flex justify-center my-2">
                                    <button className="bg-blue-500 p-2 rounded-md text-white" onClick={(e) => {
                                        e.preventDefault();
                                        // const otp = document.getElementById('otp').value;
                                        const isValid = authenticator.verify({ token: otp, secret: secret });
                                        if (isValid) {
                                            setVerifyState(true);
                                        } else {
                                            setVerifyState(false);
                                        }
                                    }}>Verify OTP</button>
                                </div>

                                {/* Display the result of the OTP verification */}
                                <div className="flex justify-center my-2">
                                    {/* Green alert box that shows success message */}
                                    {verifyState == true ? (
                                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
                                            <strong className="font-bold">Success!</strong>
                                            <span className="block sm:inline"> OTP verified successfully.</span>
                                        </div>
                                    ) : (verifyState == false ? (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                                            <strong className="font-bold">Error!</strong>
                                            <span className="block sm:inline"> OTP verification failed.</span>
                                        </div>
                                    ) : (
                                        <>
                                        </>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-center mb-6">Loading...</p>
                        )}
                    </form>
                )}
            </div>
        </>
    );
}
