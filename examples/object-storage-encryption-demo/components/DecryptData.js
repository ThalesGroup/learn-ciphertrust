import axios from "axios";
import { useState } from "react";
import { decryptData } from "../utils/crypto";
import BouncingArrow from "./BouncingArrow";


export default function DecryptDataComponent({ objectStorageURL }) {
    const [tempURL, setTempURL] = useState(null);
    const [isDecrypting, setIsDecrypting] = useState(false);

    const handleDecrypt = async () => {
        setIsDecrypting(true);

        const { data } = await axios.get(objectStorageURL)
            .catch(err => {
                console.error(err);
                setIsDecrypting(false);
            });

        let cipherText = data;

        let jwt = await axios.get(`/api/get-jwt`)
            .catch(err => {
                console.error(err);

                setIsDecrypting(false);     // Animation Preloader
            })

        jwt = jwt.data;

        // Then decrypt the ciphertext using the JWT.
        const decryptedText = await decryptData(cipherText, jwt)
            .catch(err => {
                console.error(err);
                setIsDecrypting(false);
            })

        setTempURL(decryptedText.plaintext);

        setIsDecrypting(false);
    }


    return (
        <div className="flex flex-col items-center justify-center mt-2 mb-8">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleDecrypt}>Download and Decrypt Data</button>

            {tempURL && (
                <>
                    <BouncingArrow />
                    <h1 className="text-2xl font-semibold mt-20">Decrypted Plain Text 🔓</h1>
                    <img src={"data:image/png;base64," + tempURL} className="w-96 " />
                </>
            )}

            {
                isDecrypting && (
                    <div className="fixed z-10 inset-0 flex items-center justify-center bg-sky-600/20">
                        <img src="/unlock-preloader.gif" alt="Encrypting Animation..." className='w-32 h-32' />
                    </div>
                )
            }
        </div>
    )
}