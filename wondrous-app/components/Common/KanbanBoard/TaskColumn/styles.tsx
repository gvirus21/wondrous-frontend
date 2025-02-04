import { Typography } from '@mui/material';
import styled from 'styled-components';
import { ENTITIES_TYPES } from 'utils/constants';

import palette from 'theme/palette';

export const entityStyling = {
  [ENTITIES_TYPES.PROPOSAL]: {
    style: 'min-width: 31%',
  },
};

export const DropMeHere = styled.div`
  margin: 1em 0 0 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  max-height: 400px;
  min-height: 300px;

  background: linear-gradient(180deg, #141414 0%, #151515 100%);
  border-radius: 6px;
  border: 1px dashed #4b4b4b;

  color: ${palette.white};
`;

export const TaskListContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
`;
export const TaskColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #1b1b1b;
  padding: 0px 6px 0px 6px;
  &:first-child {
    padding-left: 0px;
  }
  &:last-child {
    padding-right: 0px;
    border-right: 0;
  }
  ${({ activeEntityType }) => activeEntityType && entityStyling[activeEntityType]?.style}
`;

export const TaskColumnContainerHeader = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
`;

export const TaskColumnContainerHeaderTitle = styled(Typography)({
  '&.MuiTypography-body1': {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
    color: '#FFF',
    marginLeft: '10px',
  },
});

export const TaskColumnContainerCount = styled(Typography)`
  &.MuiTypography-body1 {
    color: #828282;
    margin-left: 10px;
    font-size: 14px;
  }
`;

export const TaskColumnDropContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
