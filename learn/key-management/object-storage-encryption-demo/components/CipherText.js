import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { FiExternalLink } from "react-icons/fi";
import { decryptData } from "../utils/crypto";
import axios from 'axios';
import Link from "next/link";
import BouncingArrow from "./BouncingArrow";

const CipherTextComponent = ({ cipherText, objectStorage, uploadedObjectURL }) => {


    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold">Encrypted Cipher Text 🕵️‍♀️</h1>
            <SyntaxHighlighter language="json" style={dracula}>
                {data}
            </SyntaxHighlighter>
            <a href={uploadedObjectURL} target="_blank"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View on {objectStorage}  <FiExternalLink className="ml-1 mb-1 inline" /></button></a>
        </div>
    );
};

export { CipherTextComponent };