import { SvgIcon } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export default function TrainIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M208 56v72H48V56a24 24 0 0 1 24-24h112a24 24 0 0 1 24 24Z"
        opacity=".2"
      />
      <path d="M184 24H72a32 32 0 0 0-32 32v128a32 32 0 0 0 32 32h8l-14.4 19.2a8 8 0 1 0 12.8 9.6L100 216h56l21.6 28.8a8 8 0 1 0 12.8-9.6L176 216h8a32 32 0 0 0 32-32V56a32 32 0 0 0-32-32ZM72 40h112a16 16 0 0 1 16 16v64H56V56a16 16 0 0 1 16-16Zm112 160H72a16 16 0 0 1-16-16v-48h144v48a16 16 0 0 1-16 16Zm-88-28a12 12 0 1 1-12-12 12 12 0 0 1 12 12Zm88 0a12 12 0 1 1-12-12 12 12 0 0 1 12 12Z" />
    </SvgIcon>
  );
}
