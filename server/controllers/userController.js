import UserModel from "../models/userModel.js";

export const getUsersData = async (req, res) => {
    try {
        const {userId} = req.body
        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(404).json({ success: false, msg: "User not found" });}
        res.status(200).json({ success: true,
            userData:{
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}