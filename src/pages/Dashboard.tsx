import Button from "@mui/material/Button";

export default function Dashboard() {
  return (
    <>
      <Button variant="contained">Primary</Button>
      <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
        Secondary
      </Button>
    </>
  );
}
