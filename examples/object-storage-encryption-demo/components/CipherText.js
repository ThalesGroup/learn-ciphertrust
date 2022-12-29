import { CopyBlock, github } from "react-code-blocks";
import { FiExternalLink } from "react-icons/fi";
import { decryptData } from "../utils/crypto";
import axios from 'axios';
import Link from "next/link";
import BouncingArrow from "./BouncingArrow";

const CipherTextComponent = ({ cipherText, objectStorage, uploadedObjectURL }) => {


    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold">Encrypted Cipher Text 🕵️‍♀️</h1>
            <CopyBlock
                language="json"
                text={cipherText}
                codeBlock
                theme={github}
                showLineNumbers={false}
            />
            <a href={uploadedObjectURL} target="_blank"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View on {objectStorage}  <FiExternalLink className="ml-1 mb-1 inline" /></button></a>
        </div>
    );
};

export { CipherTextComponent };