import * as React from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Typography from '@mui/material/Typography';

export default function SplitViewTimeLineView({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
        minWidth: '150px',
        margin: 0,
      }}
    >
      <TimelineItem sx={{ minHeight: '50px' }}>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
            {from}
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem sx={{ minHeight: '20px' }}>
        <TimelineSeparator>
          <TimelineDot color="secondary" />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main' }}>
            {to}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
