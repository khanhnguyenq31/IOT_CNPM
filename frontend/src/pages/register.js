import React, { useState } from "react";
import styled from "styled-components";

const Background = styled.div`
  background: url("https://png.pngtree.com/thumb_back/fh260/background/20240731/pngtree-precision-irrigation-systems-for-efficient-water-use-in-agriculture-broccoli-the-image_16120031.jpg") no-repeat center center/cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RegisterBox = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  width: 400px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: green;
  text-align: right;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: calc(100% - 24px); /* Đảm bảo độ dài bằng với Button */
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
      <RegisterBox>
        <Subtitle>
          SAPW <strong style={{ color: "green" }}>System</strong>
        </Subtitle>
        <Title>
          🚜 Tạo tài khoản
        </Title>
        <Input type="text" placeholder="Nhập đầy đủ tên của bạn" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <Button onClick={handleRegister}>Tạo tài khoản</Button>
        <SmallText>- Hoặc -</SmallText>
        <SmallText>
          Bạn đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </SmallText>
      </RegisterBox>
    </Background>
  );
};

export default Register;
