import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Background = styled.div`
  background: url("https://png.pngtree.com/thumb_back/fh260/background/20240731/pngtree-precision-irrigation-systems-for-efficient-water-use-in-agriculture-broccoli-the-image_16120031.jpg") no-repeat center center/cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResetPasswordBox = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  width: 350px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: black;
`;

const Input = styled.input`
  width: calc(100% - 24px);
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: green;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 15px;

  &:hover {
    background: darkgreen;
  }
`;

const SmallText = styled.p`
  font-size: 14px;
  color: #777;
  margin-top: 10px;
`;

const Link = styled.a`
  color: green;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Background>
      <ResetPasswordBox>
        <Title>Đặt lại mật khẩu</Title>
        <Input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handleResetPassword}>Đặt lại mật khẩu</Button>
        <SmallText>
          Bạn đã nhớ mật khẩu? <Link href="/login">Đăng nhập</Link>
        </SmallText>
      </ResetPasswordBox>
    </Background>
  );
};

export default ResetPassword;