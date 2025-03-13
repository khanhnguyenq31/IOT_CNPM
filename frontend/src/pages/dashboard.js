import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LogoutModal from "../components/LogoutModal";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #111;
  color: #fff;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #1a1a1a;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h2`
  color: #facc15;
  text-transform: uppercase;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: gray;
  margin-right: 10px;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
`;

const MenuItem = styled.li`
  padding: 10px 0;
  cursor: pointer;
  color: #ddd;

  &:hover {
    color: #fff;
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  padding: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: darkred;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Card = styled.div`
  background: ${(props) => props.bgColor || "#333"};
  padding: 20px;
  border-radius: 20px;
  color: #000;
  font-size: 18px;
  font-weight: bold;
  flex: 1 1 calc(50% - 40px); /* Adjust the width of the cards */
  min-width: 300px; /* Ensure a minimum width */
  box-sizing: border-box;
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: token,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Container>
      <Sidebar>
        <Logo>SAPW <span style={{ color: "green" }}>System</span></Logo>
        <UserProfile>
          <Avatar />
          <span>{user ? user.name : "Loading..."}</span>
        </UserProfile>
        <Menu>
          <MenuItem>📊 Bảng điều khiển</MenuItem>
          <MenuItem>💧 Điều khiển bơm nước</MenuItem>
          <MenuItem>🛠️ Quản lý Thiết Bị</MenuItem>
          <MenuItem>🔔 Thông Báo</MenuItem>
        </Menu>
        <LogoutButton onClick={() => setShowLogoutModal(true)}>Đăng xuất</LogoutButton>
      </Sidebar>
      <Content>
        <Card bgColor="#00bfff">
          <p>12:00</p>
          <p>Thứ 5,</p>
          <p>3/5/2025</p>
        </Card>
        <Card bgColor="#ffff66">
          <p>Nhiệt độ:</p>
          <p>Độ ẩm đất:</p>
          <p>Độ ẩm không khí:</p>
        </Card>
        <Card bgColor="#99ff99">
          <p>Số lượng thiết bị: 2</p>
          <p>Trạng thái thiết bị: <span style={{ color: "green" }}>Tốt</span></p>
          <p>Thông báo: 0 thông báo mới</p>
        </Card>
        <Card bgColor="#99ff99">
          <p>Tưới nước theo lịch trình: <span style={{ color: "green" }}>Hoàn thành</span></p>
          <p>Trạng thái môi trường: <span style={{ color: "green" }}>Tốt</span></p>
        </Card>
      </Content>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </Container>
  );
};

export default Dashboard;
