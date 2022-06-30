import React from 'react';
import {StyledCloseButton} from "./styles";

export default function CloseModalIcon(props) {
    return (
        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12.7368 4.80713L8.55949 8.98446L4.42831 13.1156"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
            <path
                d="M4.42822 4.80713L8.58248 8.96138L12.7367 13.1156"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

export const ModalCloseButton = (props) => {
    const { onClick } = props;
    return (
      <StyledCloseButton onClick={onClick}>
          <CloseModalIcon />
      </StyledCloseButton>
  );
};
