import Head from 'next/head';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { encryptData } from '../utils/crypto';
import { CipherTextComponent } from '../components/CipherText';
import { uploadToS3 } from '../utils/upload';
import DecryptDataComponent from '../components/DecryptData';
import BouncingArrow from '../components/BouncingArrow';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [tempURL, setTempURL] = useState("");
  const [onFileReadError, setOnFileReadError] = useState(false);
  const [cipherText, setCipherText] = useState(null);
  const [fullCipherText, setFullCipherText] = useState(null);
  const [objectStorageURL, setObjectStorageURL] = useState("");

  // Useless animation that makes the demo look cool 😎
  const [isEncrypting, setIsEncrypting] = useState(false);


  const onDrop = useCallback(acceptedFiles => {
    // Temporarily set the file data as a react state.
    setFile(acceptedFiles[0]);
    // Set the temporary URL to the file data.
    const fileURI = URL.createObjectURL(acceptedFiles[0]);
    setTempURL(fileURI);
  }, []);

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '*',
    minSize: 0,
    maxSize: 1048576 * 100,
  });


  const logos = [
    ["Google Cloud Storage", "/logos/GCS-250x192.png"],
    ["AWS S3", "/logos/Amazon-S3-Logo.svg.png"],
    ["Azure Blob Storage", "/logos/azure-storage-blob--v1.png"],
  ]



  const handleEncryptUpload = async () => {

    setIsEncrypting(true);

    let jwt = await axios.get(`/api/get-jwt`)
      .catch(err => {
        console.error(err);

        setIsEncrypting(false);     // Animation Preloader
      })

    jwt = jwt.data;

    setCipherText("");

    // Let's encrypt our data using the Ciphertrust manager API.
    const cipherText = await encryptData(file, jwt)
      .catch(err => {
        console.error(err);
        setIsEncrypting(false);
      })

    const objectStorageURL = await uploadToS3(cipherText, file.name);

    setObjectStorageURL(objectStorageURL);
    setIsEncrypting(false);

    localStorage.setItem("cipherText", cipherText);

    let displayCipherText = cipherText;
    displayCipherText["ciphertext"] = displayCipherText["ciphertext"].substring(0, 40) + "...";
    displayCipherText["id"] = displayCipherText["id"].substring(0, 40) + "...";
    displayCipherText = JSON.stringify(cipherText, null, 2);
    setCipherText(displayCipherText);
  };

  return (
    <>
      {/* Star this on GitHub button */}
      <button></button>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>Encrypt Data to Object Storage</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-4xl font-bold">
            🔐 Encrypt Your Files and Upload It To
          </h1>

          <div className='my-10 grid grid-cols-1 md:grid-cols-3 items-center gap-24'>
            {logos.map(([name, logo]) => (
              <div className='flex flex-col items-center'>
                <img className='w-16 h-16 md:w-24 md:h-24' src={logo} />
                <p className='text-sm'>{name}</p>
              </div>
            ))}
          </div>

          {/* Add button that links to Github Source Code */}
          <a href="https://github.com/snpranav/object-storage-encryption-demo"><button className="bg-black text-white p-3 mb-8 rounded-md font-semibold">View Code on <FaGithub className="inline" /></button></a>


          <p className="my-3 text-2xl font-semibold">
            Try it out 👇
          </p>

          <div {...getRootProps()}>
            <div className="flex justify-center items-center w-full" >
              {
                isEncrypting && (
                  <div className="fixed z-10 inset-0 flex items-center justify-center bg-sky-600/20">
                    <img src="/lock-preloader.gif" alt="Encrypting Animation..." className='w-32 h-32' />
                  </div>
                )
              }
              <input id="dropzone-file" type="file" className="hidden"
                {...getInputProps()}
              />
              <div for="dropzone-file" className="flex flex-col justify-center items-center w-full lg:px-64 md:px-32 px-10 h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                  {!file ? (
                    <>
                      <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      {isDragActive ? (
                        <>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Drop your files <span className='font-semibold'>here 📥</span></p>
                        </>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">any file type (MAX. 100 MB)</p>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <img className='w-20' src={tempURL} />
                      <p className='text-sm text-gray-500 dark:text-gray-400'>{file.name} | (Size - {(file.size / 1048576).toFixed(2)} MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button className='bg-blue-500 text-white hover:bg-blue-600 p-3 mt-4 rounded-md font-semibold' onClick={handleEncryptUpload}>Encrypt and Upload</button>
          {onFileReadError && <p className='text-red-500'>Oops, there was an error encrypting your file. Please try again!</p>}

          {/* Add an animated down arrow to show people should scroll down */}
          {
            cipherText && (
              <BouncingArrow />
            )
          }


        </main>

      </div>

      {cipherText && (
        <>
          <CipherTextComponent cipherText={cipherText} objectStorage="AWS S3" uploadedObjectURL={objectStorageURL} />

          <DecryptDataComponent objectStorageURL={objectStorageURL} />
        </>
      )}

      <footer className="flex flex-col h-24 w-full items-center justify-center border-t">
        <div>
          <a
            className="items-center justify-center gap-2"
            href="https://snpranav.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built by <span className="text-blue-500 hover:text-blue-700 cursor-pointer">Pranav Shikarpur</span>
          </a>
          <a href='https://github.com/snpranav' className='ml-2 hover:text-blue-700 cursor-pointer' target={'_blank'}><FaGithub className='inline' /></a>
          <a href='https://twitter.com/snpranav' className='ml-2 hover:text-blue-700 cursor-pointer' target={'_blank'}><FaTwitter className='inline' /></a>
        </div>
        <div>
          <p>Tech used: <a href="https://cpl.thalesgroup.com/encryption/ciphertrust-manager?ref=https://github.com/snpranav/object-storage-encryption-demo" className='text-blue-500 hover:text-blue-700' target={'_blank'}>CipherTrust Manager</a>, <a href="https://aws.amazon.com/s3/" className='text-blue-500 hover:text-blue-700'>AWS S3</a>, <a href="https://nextjs.org/?ref=https://github.com/snpranav/object-storage-encryption-demo" className='text-blue-500 hover:text-blue-700'>NextJS</a></p>
        </div>
      </footer>
    </>
  );
}

export default UploadPage;
