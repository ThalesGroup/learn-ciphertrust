import { CopyBlock, github } from "react-code-blocks";

const DecryptedDataComponent = ({ data, dbName }) => {


    return (
        <div className="flex flex-col items-center justify-center mt-12">
            <h1 className="text-2xl font-semibold">Decrypted Data <span className="text-orange-500">NOT</span> Stored In {dbName} DB </h1>
            <CopyBlock
                language="json"
                text={data}
                codeBlock
                theme={github}
                showLineNumbers={false}
            />
        </div>
    );
};

export { DecryptedDataComponent };