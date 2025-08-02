import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOtp = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email,
      });
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp,
      });
      if (res.data.success) {
        toast.success("OTP verified");
        setStep(3);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email,
        newPassword,
      });
      if (res.data.success) {
        toast.success("Password reset successfully");
        setStep(1);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="w-[90%] sm:max-w-96 m-auto mt-20 text-gray-800 flex flex-col gap-4">
      <h2 className="text-2xl mb-4">Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border"
            required
          />
          <button onClick={handleSendOtp} className="bg-black text-white py-2">
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border"
            required
          />
          <button onClick={handleVerifyOtp} className="bg-black text-white py-2">
            Verify OTP
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border"
            required
          />
          <button onClick={handleResetPassword} className="bg-black text-white py-2">
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
