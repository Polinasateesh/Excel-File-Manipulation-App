import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { Card, Link } from '@mui/material';

const Home = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState({ rowIndex: null, cellIndex: null, value: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const isUserRegistered = JSON.parse(window.localStorage.getItem('userInfo'));
        const isLogin = window.localStorage.getItem('isLogedIn');

        if (isUserRegistered === null) {
            navigate('/');
        } else if (!isLogin) {
            navigate('/Login');
        }
    }, [navigate]);

    const handleFileUpload = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                setExcelData(jsonData);
                setError(null);
            } catch (error) {
                setError('Error reading Excel file');
                setExcelData([]);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleCellClick = (rowIndex, cellIndex, value) => {
        console.log('rowIndex',rowIndex);
        console.log('cellIndex',cellIndex);
        console.log('value',value);
        setEditMode({ rowIndex, cellIndex, value });
    };


   
    const handleCellChange = (event) => {
        setEditMode({ ...editMode, value: event.target.value });
    };

    const handleCellKeyPress = (event) => {
        if (event.key === 'Enter') {
            
        }
    };


    const modifyExcel = () => {
        console.log("clicked");
        console.log('value',editMode);
        // Update the excelData with the edited value
        const updatedData = excelData.map((row, rowIndex) =>
            row.map((cell, cellIndex) =>
                rowIndex === editMode.rowIndex && cellIndex === editMode.cellIndex ? editMode.value : cell
            )
        );
        console.log('updatedData',updatedData);
        setExcelData(updatedData);
        
    };

    const downloadSample = () => {
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'ModifiedExcel.xlsx');
    };

    useEffect(() => {
        const expectedColumns = ['Column1', 'Column2', 'Column3'];
        const actualColumns = excelData.length > 0 ? excelData[0] : [];
        const isColumnsMatch = expectedColumns.every((col, index) => col === actualColumns[index]);

        if (!isColumnsMatch) {
            setError('Columns do not match expected structure.');
        } else {
            setError(null);
        }
    }, [excelData]);

    return (
        <Card>
            <div style={containerStyle}>
                <Dropzone onDrop={(acceptedFiles) => handleFileUpload(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} style={dropzoneStyles}>
                            <input {...getInputProps()} />
                            <p style={uploadText}>Drag 'n' drop an Excel file here, or <Link>click to select one</Link></p>
                        </div>
                    )}
                </Dropzone>

                {uploadedFile && (
                    <div>
                        <h3 style={headerStyle}>Uploaded Excel Data:</h3>
                        <table style={tableStyle}>
                            <tbody>
                                {excelData.map((row, rowIndex) => (
                                    <tr key={rowIndex} style={tableCellStyle}>
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                style={rowIndex === 0 ? tableHeaderStyle : tableCellStyle}
                                                onClick={() => handleCellClick(rowIndex, cellIndex, cell)}
                                            >
                                                {editMode.rowIndex === rowIndex && editMode.cellIndex === cellIndex ? (
                                                    <input
                                                        type="text"
                                                        value={editMode.value}
                                                        onChange={handleCellChange}
                                                        onKeyPress={handleCellKeyPress}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    cell
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {error && <p style={errorStyle}>{error}</p>}

                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={modifyExcel}>
                       update
                    </button>
                    <button style={buttonStyle} onClick={downloadSample}>
                        Download Excel
                    </button>
                </div>
            </div>
        </Card>
    );
};

const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
};

const dropzoneStyles = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

const uploadText = {
    fontSize: '16px',
    color: '#555',
};

const headerStyle = {
    fontSize: '16px',
    marginBottom: '10px',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
};

const tableHeaderStyle = {
    background: '#ddd',
    padding: '10px',
    textAlign: 'left',
    border:'1px solid #ddd'
};

const tableCellStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
};

const errorStyle = {
    color: 'red',
    marginBottom: '20px',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    background: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
};

export default Home;
