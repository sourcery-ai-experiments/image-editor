import {
  Typography,
  CircularProgress,
  Box,
  Input,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { Dispatch, SetStateAction, useState } from "react";
import { BaseURL } from "../../constants";
import { APIResponse } from "../../types";
import toast from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";
import { useCanvasContext } from "../../context/CanvasContext";
import CountdownTimer from "../../components/counter/counter";
import { usePaginationContext } from "../../context/MultiCanvasPaginationContext";

const StyledContainer = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "80vh",
  backgroundColor: "white",
  color: "white",
  width: "100%",
  marginTop: "10px",
}));

interface Props {
  setScrappedData: Dispatch<SetStateAction<APIResponse | undefined>>;
  updateStep: Dispatch<SetStateAction<number>>;
}

function LandingPage({ setScrappedData, updateStep }: Props) {
  const { isAuthenticated } = useAuth0();
  const { scrapURL, updateScrapURL } = useCanvasContext();
  const { destroyMultiCanvas } = usePaginationContext();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    if (loading) return;

    try {
      destroyMultiCanvas();
      setLoading(true);
      const response = await fetch(`${BaseURL}/scrapping_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: scrapURL }), // Use scrapURL instead of inputValue
      });
      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        return toast.error(data?.error);
      }

      await setScrappedData(data);
      updateStep(2);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        {isAuthenticated ? (
          <StyledContainer>
            <Typography variant="h4" gutterBottom color="black">
              PASTE NEWS LINK URL
            </Typography>
            <Input
              value={scrapURL}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateScrapURL(e.target.value)
              }
              sx={{
                width: "355px",
              }}
            />
            <Button
              variant="contained"
              sx={{
                mt: "30px",
                bgcolor: "white",
                color: "black",
                "&:hover": { bgcolor: "white", color: "black" },
              }}
              onClick={getData}
              disabled={loading}
            >
              {loading ? <CountdownTimer /> : "GO >>"} &nbsp;&nbsp;{" "}
              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </StyledContainer>
        ) : (
          <StyledContainer>
            <Typography variant="h4" sx={{ color: "black" }} gutterBottom>
              POSTICLE.AI
            </Typography>
            <Typography variant="body1" sx={{ color: "black" }} gutterBottom>
              CREATE & SHARE THE LATEST NEWS WITH
            </Typography>
          </StyledContainer>
        )}
      </Box>
    </>
  );
}

export default LandingPage;
