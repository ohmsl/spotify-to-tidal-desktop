import { Stepper as MuiStepper, Step, StepLabel } from "@mui/material";

type Props = {
  step: number;
};

const Stepper = ({ step }: Props) => {
  return (
    <MuiStepper activeStep={step} sx={{ mx: 4, mb: 2 }}>
      <Step>
        <StepLabel>Choose playlist</StepLabel>
      </Step>
      <Step>
        <StepLabel>Confirm Playlist</StepLabel>
      </Step>
      <Step>
        <StepLabel>Convert Playlist</StepLabel>
      </Step>
    </MuiStepper>
  );
};

export default Stepper;
