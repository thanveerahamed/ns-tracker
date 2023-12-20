import { useSignOut } from 'react-firebase-hooks/auth';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Drawer, ListItemButton, ListItemIcon } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { auth } from '../services/firebase.ts';

interface Props {
  open: boolean;
  onClose: () => void;
}
export default function MenuDrawer({ open, onClose }: Props) {
  const [signOut] = useSignOut(auth);
  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <List>
        <ListItem>
          <ListItemButton onClick={() => signOut()}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
