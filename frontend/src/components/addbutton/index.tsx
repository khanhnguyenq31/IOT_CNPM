import React from "react";
import Container from "@/components/container";
import { IoAddOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

const AddButton = ({onClick }: AddButtonProps) => {
  const intl = useTranslations("Components");
  return (
    <button>
      <Container className="w-[150px] h-[150px] items-center justify-center flex flex-col ">
      <IoAddOutline className=" text-[100px] " />
      <h1>
      {intl("adddevice")}
      </h1>
      </Container>
    </button>
  );
};

export default AddButton;
