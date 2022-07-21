import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import { OverviewComponent } from 'components/Wrapper/styles';
import { Button } from 'components/Button';

export const ErrorWrapper = styled(OverviewComponent)`
  && {
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #170c4b 0%, #0f0f0f 100%);
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-top: 72px;
    gap: 38px;
  }
`;

export const ErrorImage = styled.img`
  max-width: 50%;
`;

export const ErrorHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 28px;
    line-height: 36px;
    background: linear-gradient(269.64deg, #ff6dd7 21.65%, #dcd26b 71.17%, #06ffa5 82.52%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export const EscapeButton = styled(Button)`
  && {
    align-self: auto;
  }
`;
