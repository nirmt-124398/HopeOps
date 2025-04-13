import prisma from "../lib/prismaclient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {


        // Check if user exists
        const userExist = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userExist) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                username,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: role || 'USER',
            },
        });

        // Remove password from newUser object
        const { password: _, ...restInfo } = newUser;



        return res.status(201).json(restInfo);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error Registering User" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sanitize email
        const sanitizedEmail = email?.toLowerCase().trim();


        // For findUnique, we can only query by the unique field without additional filters
        const user = await prisma.user.findUnique({
            where: {
                email: sanitizedEmail,
            }
        });

        if (!user) {
            console.log(`No user found with email: ${sanitizedEmail}`);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            console.log('Invalid password attempt');
            return res.status(400).json({ error: 'Invalid credentials' }); // Use generic message for security
        }

        // Create JWT
        const age = 1000 * 60 * 60 * 24 * 7; // 7 days
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: age / 1000 }
        );

        // Remove password from response
        const { password: _, ...userInfo } = user;

        // Set cookie and send response
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: age,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).status(200).json(userInfo);

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const logout = (req, res) => {
    try {
        res
            .clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            })
            .status(200)
            .json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Failed to logout" });
    }
};

