import styled from '@emotion/styled';
import Box from '@mui/material/Box';

const LoaderWrapper = styled(Box)`
  width: 65px;
  height: 65px;
  border: 8px solid #ee9b00a6;
  border-radius: 50px;
  position: relative;

  span {
    display: block;
    background: #ee9b00;
  }

  .hour,
  .min {
    width: 6px;
    height: 22px;
    border-radius: 50px;
    position: absolute;
    top: 24.5px;
    left: 21px;
    animation: load9243 1.2s linear infinite;
    transform-origin: top center;
  }

  .min {
    height: 17px;
    animation: load9243 4s linear infinite;
  }

  .circel {
    width: 10px;
    height: 10px;
    border-radius: 50px;
    position: absolute;
    top: 19px;
    left: 19px;
  }

  @keyframes load9243 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function ClockLoader() {
  return (
    <LoaderWrapper>
      <span className="hour"></span>
      <span className="min"></span>
      <span className="circel"></span>
    </LoaderWrapper>
  );
}
