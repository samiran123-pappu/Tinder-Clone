import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
	// jwt token
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
};
export const signup = async (req, res) => {
    console.log("Signup request body:", req.body);  // ← ADD THIS FOR DEBUGGING

    const { name, email, password, gender, genderPreference } = req.body;
    const age = Number(req.body.age);

    try {
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (age < 18) {
            return res.status(400).json({ message: "Age should be greater than 18" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            age,
            gender,
            genderPreference
        });

        const token = signToken(newUser._id);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            user: newUser
        });

    } catch (error) {
        console.log("error in signup:", error);  // ← This will show exact error

        // Handle duplicate email (common)
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Handle validation errors (e.g., wrong gender value)
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({
            success: false,
            message: "Error in signup",
            error: error.message
        });
    }
};

export const login = async(req, res)=>{
    const {email, password} = req.body;
    try {
    if(!email || !password){
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    const user = await User.findOne({email}).select("+password");
    if(!user || !await user.matchPassword(password)){
        return res.status(404).json({success: false, message: "User not found"});
    }

    const token = signToken(user._id);

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
        success: true,
        user,
    });
        
    } catch (error) {
        console.log("error in login", error);
        res.status(500).json({
            success: false,
            message: "Error in login",
            error: error.message
        });
        
    }

}


export const logout = (req, res)=>{
    res.clearCookie("jwt");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}






