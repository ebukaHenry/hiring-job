const express=require("express");
const cors=require("cors");
const authRoute=require("./routes/auth");
const uploadRoute=require("./routes/upload");
const jobRoute=require("./routes/jobs");
const adminRoute=require("./routes/admin");
const applicantsRoute=require("./routes/applicants");
require("dotenv").config();

const app=express();

app.use(cors());
app.use(express.json());
app.use("/uploads",express.static("uploads"));
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/applicants", applicantsRoute);

const PORT=process.env.port|| 8080;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});