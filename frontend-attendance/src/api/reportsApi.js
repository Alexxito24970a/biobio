import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

export const downloadExcel = () => {
    window.open(`${API_URL}/export/excel`, "_blank");
};

export const downloadPDF = () => {
    window.open(`${API_URL}/export/pdf`, "_blank");
};

export const getAttendanceStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};
