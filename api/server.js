import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import path from "path";



import { initializeSocket } from "./socket/socket.server.js";
import authRoutes from "./routes/authRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import {connectDB} from "./config/db.js";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


initializeSocket(httpServer);


app.use(express.json()); //read coming from json
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));

	app.get("/{*any}", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}



httpServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});







// userSchema.pre('save', function (next) {
//   if (!this.isModified('password')) return next();
//   bcrypt.hash(this.password, 10, (err, hash) => {
//     if (err) return next(err);
//     this.password = hash;
//     next();
//   });

// }); from this to.....

// this

// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;
//   this.password = await bcrypt.hash(this.password, 10);
// });





// also

// app.get("*", (req, res) => {
// res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
// });... not this one

// }..from this to this

// app.get(/.*/, (req, res) => {
// res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
// });.. both works

// app.get("/{*any}", (req, res) => {
// res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
// });