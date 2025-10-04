import axios from "axios";

const API_URL = "http://localhost:5000/api/timetable";

export const getTimetable = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const saveTimetable = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const deleteTimetable = async () => {
  const res = await axios.delete(API_URL);
  return res.data;
};
