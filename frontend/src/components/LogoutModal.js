import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const Title = styled.h2`
  color: black;
`;

const Message = styled.p`
  color: black;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const ConfirmButton = styled(Button)`
  background: green;
  color: white;

  &:hover {
    background: darkgreen;
  }
`;

const CancelButton = styled(Button)`
  background: red;
  color: white;

  &:hover {
    background: darkred;
  }
`;

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Xác nhận đăng xuất</Title>
        <Message>Bạn có chắc chắn muốn đăng xuất?</Message>
        <ConfirmButton onClick={onConfirm}>Xác nhận</ConfirmButton>
        <CancelButton onClick={onCancel}>Hủy</CancelButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LogoutModal;