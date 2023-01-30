import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const DecryptedDataComponent = ({ data, dbName }) => {


    return (
        <div className="flex flex-col items-center justify-center mt-12">
            <h1 className="text-2xl font-semibold">Decrypted Data <span className="text-orange-500">NOT</span> Stored In {dbName} DB </h1>
            <SyntaxHighlighter language="json" style={dracula}>
                {data}
            </SyntaxHighlighter>
        </div>
    );
};

export { DecryptedDataComponent };