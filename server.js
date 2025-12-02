import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Portfolio Backend is running ✅");
});

// API route to send email
app.post("/send-email", async (req, res) => {
  const { fullName, email, description } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Anayo Caleb Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Portfolio Contact Message",
      html: `
        <h2>New Portfolio Contact Message</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${description}</p>

        <hr/>
        <p style="font-size:12px;color:gray;">
          This message was sent from your portfolio contact form.
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

