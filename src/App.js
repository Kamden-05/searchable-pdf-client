import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFiledPicked] = useState(false);
  const [isValidFile, setIsValidFile] = useState(false);

  function handleClearClick() {
    setSelectedFile(null);
    setIsFiledPicked(false);
    setIsValidFile(false);
  }

  const onFileChange = (e) => {
    if (e.target.files[0] != null) {
      setSelectedFile(e.target.files[0]);
      setIsFiledPicked(true);
      if (e.target.files[0].type === "application/pdf") setIsValidFile(true);
      else setIsValidFile(false);
    } else {
      setIsFiledPicked(false);
      setSelectedFile(null);
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/convert", {
        method: "POST",
        body: formData,
        responseType: "text",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDownload = (filePath, fileName = "searchable.pdf") => {

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("http://localhost:5000/convert", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        link.parentNode.removeChild(link);
      });
  };

  return (
    <>
      <h1>Searchable PDF Converter</h1>
      <div>
        <input type="file" name="file" onChange={onFileChange} />
        {isFilePicked ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            {isValidFile ? (
              <button onClick={handleDownload}>Convert</button>
            ) : (
              <p>file must be a pdf</p>
            )}
            <button onClick={handleClearClick}>Clear</button>
          </div>
        ) : (
          <p>Upload a PDF to convert</p>
        )}
      </div>
    </>
  );
}

export default App;

//const [data, setData] = useState([{}]);

// const getMembers = async () => {
//   try {
//     const response = await fetch("http://localhost:5000/members");
//     const jsonData = await response.json();
//     setData(jsonData);
//   } catch (error) {
//     console.error(error.message);
//   }
// };

// useEffect(() => {
//   getMembers();
// }, []);

// const handleDownload = (filePath, fileName = "searchable.pdf") => {
//   fetch("http://localhost:5000/return-file", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/pdf",
//     },
//   })
//     .then((response) => response.blob())
//     .then((blob) => {
//       const url = window.URL.createObjectURL(new Blob([blob]));

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;

//       document.body.appendChild(link);

//       link.click();

//       link.parentNode.removeChild(link);
//     });
// };
