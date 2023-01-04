import { CopyBlock, github } from "react-code-blocks";

const EncryptedDataComponent = ({ cipherText, dbName }) => {


    return (
        <div className="flex flex-col items-center justify-center mt-12">
            <h1 className="text-2xl font-semibold">Encrypted Data Stored In {dbName} DB 🕵️‍♀️</h1>
            <CopyBlock
                language="json"
                text={cipherText}
                codeBlock
                theme={github}
                showLineNumbers={false}
            />
        </div>
    );
};

export { EncryptedDataComponent };