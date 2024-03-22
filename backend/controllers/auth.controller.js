import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokens.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ error: "password and confirm password don't matched" });

    const user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: "Username already exists" });

    // hash password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // https://avatar-placeholder.iran.liara.run/

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender == "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      //generate jwt token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400), json({ error: "invadlid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.send(500).json({ error: "internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
  } catch (error) {
    console.log("error in login controller", error.message);
    res.send(500).json({ error: "internal server error" });
  }
};
export const logout = (req, res) => {
  res.send("logoutUser");
};
