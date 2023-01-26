import Head from "next/head";
import Image from "next/image";
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SiPostgresql, SiAmazondynamodb, SiMongodb } from "react-icons/si";
import { HiOutlineIdentification } from "react-icons/hi";
import axios from "axios";
import { randomUUID } from "crypto";
import { EncryptedDataComponent } from "../components/EncryptedData";
import BouncingArrow from "../components/BouncingArrow";
import { DecryptedDataComponent } from "../components/DecryptedData";
import FooterComponent from "../components/Footer";
import { FaGithub } from "react-icons/fa";

export default function DPG() {
  const [file, setFile] = useState(null);
  const [tempURL, setTempURL] = useState("");
  const [onFileReadError, setOnFileReadError] = useState(false);
  const [encryptedData, setEncryptedData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");
  const [dbName, setDBName] = useState("");
  const [recordID, setRecordID] = useState("");

  // React state that maintains form Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    dateOfAppointment: "",
    insuranceID: ""
  });

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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

  // `handlePostData` is called when the user clicks the "Submit" button is clicked for each database button.
  const handlePostData = async (db) => {
    // Set db type to state.
    setDBName(db);


    let { data } = await axios.post("/api/post-data", formData, {
      headers: {
        "Content-Type": "application/json",
        "db-type": db,
      }
    });

    const id = data.id;
    setRecordID(id);

    // Fetch the encrypted data from the database.
    const res = await axios.post("/api/get-with-encrypted-fields", {
      id: id
    }, {
      headers: {
        "Content-Type": "application/json",
        "db-type": db,
      }
    });

    // Set the encrypted data as a react state.
    setEncryptedData(JSON.stringify(res.data, null, 4));
  }

  // `handlePostData` is called when the user clicks the "Submit" button is clicked for each database button.
  const handleGetData = async () => {


    let { data } = await axios.post(`/api/get-data`,
      encryptedData,
      {
        headers: {
          "Content-Type": "application/json",
          "db-type": dbName,
        }
      });

    setDecryptedData(JSON.stringify(data, null, 4));
  }

  return (
    <div className="flex min-h-screen flex-col py-2">
      <Head>
        <title>Data Encryption in Transit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="text-center px-2 my-auto pt-12 md:pt-0">
          <div className="flex flex-col">
            <h1 className="text-6xl font-bold">Encrypt Your Customers' Sensetive Data</h1>

            {/* Add button that links to Github Source Code */}
            <a href="https://github.com/snpranav/data-encryption-in-transit-demo"><button className="bg-black text-white p-3 mb-8 rounded-md font-semibold">View Code on <FaGithub className="inline" /></button></a>
          </div>
          <h3 className="text-3xl font-semibold">With <span className="text-yellow-500">No Change</span> to Your Applications</h3>
        </div>
        <div className="my-auto mx-auto">
          <img src="/68999-file-encryption.gif" />
        </div>
      </div>

      <section className=" bg-gray-50 py-20 mt-20 lg:mt-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Welcome to XYZ Hospital
          </h1>

          <p className="mt-3 text-2xl">
            Fill out your personal information to schedule an appointment.
          </p>
        </div>


        <div className="sm:w-3/4 lg:w-5/12 mx-auto">
          <div className=" flex flex-col sm:flex-row gap-6 mt-8">
            <div className=" flex flex-col flex-1 px-2 py-3">
              <label className="block mb-2 text font-medium text-gray-900">First Name</label>
              <input
                type="text"
                placeholder="Enter patient name"
                className=" focus:outline-none rounded-md text-black border-2 border-blue-600  px-2 py-3"
                // value={initialValue}
                onChange={e => handleInputChange(e)}
                name="firstName"
              ></input>
            </div>
            <div className=" flex flex-col flex-1 px-2 py-3">
              <label className="block mb-2 text font-medium text-gray-900">Last Name</label>
              <input
                type="text"
                placeholder="Enter Last Name"
                className=" focus:outline-none rounded-md text-black border-2 border-blue-600  px-2 py-3"
                onChange={e => handleInputChange(e)}
                name="lastName"
              ></input>
            </div>
          </div>

          <div className=" flex flex-col sm:flex-row gap-6 mt-8">
            <div className=" flex flex-col flex-1 px-2 py-3">
              <label className="block mb-2 text font-medium text-gray-900">Date of Birth</label>
              <input type="date" id="start" className="focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600"
                min="1900-01-01" max="2018-12-31"
                onChange={e => handleInputChange(e)}
                name="dateOfBirth" />
            </div>
            <div className=" flex flex-col flex-1 px-2 py-3">
              <label className="block mb-2 text font-medium text-gray-900">Social Security Number</label>
              <input
                type="number"
                placeholder="Enter Social Security Number"
                className=" focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600"
                onChange={e => handleInputChange(e)}
                name="ssn"
              ></input>
            </div>
          </div>

          <div className=" flex flex-col sm:flex-row gap-6 mt-8">
            <div className=" flex flex-col flex-1 px-2 py-3">
              <label className="block mb-2 text font-medium text-gray-900">Date of Appointment</label>
              <input type="date" id="start" className="focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600"
                min="2022-03-20" max="2022-12-31"
                onChange={e => handleInputChange(e)}
                name="dateOfAppointment" />
            </div>
            <div className=" flex flex-col flex-1 px-2 py-3">
              <label className="block mb-2 text font-medium text-gray-900">Insurance ID</label>
              <input
                type="text"
                placeholder="Enter Insurance ID"
                className=" focus:outline-none flex-1 px-2 rounded-md text-black border-2 border-blue-600"
                onChange={e => handleInputChange(e)}
                name="insuranceID"
              ></input>
            </div>
          </div>

        </div>

        {/* 3 buttons in a rowthat say submit to the 3 databases */}
        <p className="text-xl font-semibold text-center mt-8 mb-2">Submit to 👇</p>
        <div className="flex md:flex-row flex-col justify-center items-center  gap-12">
          <button className="bg-blue-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full text-xl" onClick={e => handlePostData("dynamo")}>Amazon Dynamo DB <SiAmazondynamodb className="ml-2 inline" /></button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-xl" onClick={e => handlePostData("postgres")}>PostgreSQL <SiPostgresql className="ml-2 inline" /></button>
          <button className="bg-blue-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-xl" onClick={e => handlePostData("mongo")}>Mongo DB <SiMongodb className="ml-2 inline" /></button>
        </div>
      </section>

      {/* Button to decrypt the data */}



      {encryptedData && (
        <div className="flex flex-col justify-center items-center">
          <BouncingArrow />
          <EncryptedDataComponent cipherText={encryptedData} dbName={dbName.charAt(0).toUpperCase() + dbName.slice(1)} />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-xl" onClick={e => handleGetData()}>Decrypt Data</button>
        </div>
      )}




      {decryptedData && (
        <div className="flex flex-col justify-center items-center mb-8s">
          <BouncingArrow />
          <DecryptedDataComponent data={decryptedData} dbName={dbName.charAt(0).toUpperCase() + dbName.slice(1)} />
        </div>
      )}


      <FooterComponent />
    </div>

  )
}