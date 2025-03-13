import React, { useState } from "react";
import styled from "styled-components";

const Background = styled.div`
  background: url("https://png.pngtree.com/thumb_back/fh260/background/20240731/pngtree-precision-irrigation-systems-for-efficient-water-use-in-agriculture-broccoli-the-image_16120031.jpg") no-repeat center center/cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ForgotPasswordBox = styled.div`
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Background>
      <ForgotPasswordBox>
        <Title>Quên mật khẩu</Title>
        <Input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleForgotPassword}>Gửi email đặt lại mật khẩu</Button>
        <SmallText>
          Bạn đã nhớ mật khẩu? <Link href="/login">Đăng nhập</Link>
        </SmallText>
      </ForgotPasswordBox>
    </Background>
  );
};

export default ForgotPassword;