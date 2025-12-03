import express from "express";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Portfolio Backend is running ✅");
});

// API route to send email
app.post("/send-email", async (req, res) => {
  const { fullName, email, description } = req.body;

  const msg = {
    to: process.env.EMAIL_TO,          // Inbox to receive emails
    from: process.env.EMAIL_FROM,      // Verified sender email in SendGrid
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

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.error("SendGrid Email Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
