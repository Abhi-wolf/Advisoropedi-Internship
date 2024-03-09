/* eslint-disable react/prop-types */
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { Cross1Icon } from "@radix-ui/react-icons";
import { IconButton, Theme } from "@radix-ui/themes";
import { useTheme } from "../contexts/ThemeContext";

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { theme } = useTheme();

  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-screen bg-[var(--backdrop-color)] backdrop-blur-[4px] z-50 transition-all duration-500">
      <Theme
        accentColor="red"
        radius="medium"
        grayColor="gray"
        panelBackground="solid"
        appearance={theme}
      >
        <div
          ref={ref}
          className="fixed w-4/5 md:w-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:px-12 md:py-6 transition-all duration-500 border-2  rounded-lg border-gray-100 "
        >
          <IconButton
            onClick={close}
            className="absolute top-1 right-1 md:top-5  md:right-6 hover:cursor-pointer hover:font-bold "
          >
            <Cross1Icon />
          </IconButton>
          <div>{cloneElement(children, { onCloseModal: close })}</div>
        </div>
      </Theme>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
