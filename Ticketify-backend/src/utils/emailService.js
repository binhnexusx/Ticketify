const { body } = require("express-validator");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Sticky Hotel" <${process.env.EMAIL_USER}>`,
    to,
    subject: "OTP Verification Code",
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendBookingEmail = async ({
  user,
  booking,
  room,
  total_price,
  nights,
}) => {
  const mailOptions = {
    from: `"Sticky Hotel" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Sticky Hotel! Thank you for your booking!",
    html: `
      <p>Hello <strong>${user.name}</strong>,</p>
      <p><strong>#Booking ${
        booking.booking_id
      }</strong> - Your booking was successfully!</p>
      <ul>
        <li><strong>Your Stays:</strong> ${nights} night(s)</li>
        <li><strong>Check-In:</strong> ${booking.check_in_date}</li>
        <li><strong>Check-Out:</strong> ${booking.check_out_date}</li>
        <li><strong>Room Type:</strong> ${room.room_type_name}</li>
        <li><strong>Room Level:</strong> ${room.room_level_name}</li>
        <li><strong>Total Price:</strong> $${total_price * nights}</li>
      </ul>
      <p><strong>Note:</strong></p>
      <p>Check-in time: <strong>at 14:00</strong> on the day of arrival</p>
      <p>Check-out time: <strong>at 12:00</strong> on the day of departure</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail, sendBookingEmail };
