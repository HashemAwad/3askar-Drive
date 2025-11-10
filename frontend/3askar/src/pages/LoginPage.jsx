import React, {useState} from "react";
import { Box, Paper, Typography, TextField, Link, Button } from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleNext = ()=> {
    alert(`Next clicked with email: ${email || "(empty)"} - UI only`);
  };

  return (
    <Box 
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      {/* White card*/}
      <Paper
        elevation={3}
        sx={{
          width: "10.6cm" ,
          maxWidth: "92vw",
          p: 4,
          borderRadius: 2,
        }}

      >
        {/* Header Section */}
        

        <Box sx={{ display: "grid", justifyItems: "center", mb: 2 }}>
          {/* Google wordMark build with colored spans*/}
          <Typography
            sx={{
              fontSize: 28,
              letterSpacing: 0.2,
              mb: 1,
              userSelect: "none",
            }}
          >
            <Box component="span" sx={{ color: "#1a73e8", fontWeight: 549}}>G</Box>
            <Box component="span" sx={{ color: "#ea4335", fontWeight: 549}}>o</Box>
            <Box component="span" sx={{ color: "#fbbc05", fontWeight: 549}}>o</Box>
            <Box component="span" sx={{ color: "#1a73e8", fontWeight: 549}}>g</Box>
            <Box component="span" sx={{ color: "#34a853", fontWeight: 549}}>l</Box>
            <Box component="span" sx={{ color: "#ea4335", fontWeight: 549}}>e</Box>
          </Typography>

          {/*Main heading*/}
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 0.5 }}>
            Sign in
          </Typography>

          {/* subtitle */}
          <Typography variant="body2" color="blackSecondary" sx={{ mb: 1 }}>
            to continue to Google Drive
          </Typography>

        </Box>
        
        <TextField
          label="Email or phone"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          sx={{
            mt: 2,
            backgroundColor: "#fff",       // ✅ always white background
            input: {
              color: "#000",               // ✅ black text                                     !!!!!!NEED TO FIX AUTO COMOPLETE BUG!!!!!!!!!!!
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#f6fafe",    // light gray border
              },
              "&:hover fieldset": {
                borderColor: "#dadce0",    // no hover darkening
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1a73e8",    // blue border on focus
              },
            },
          }}
        />


        <TextField
          label="Enter your password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          sx={{
            mt: 2,
            backgroundColor: "#fff",
            input: {
              color: "#000",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#dadce0",
              },
              "&:hover fieldset": {
                borderColor: "#dadce0",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1a73e8",
              },
            },
          }}
        />



        <Link
          href="#"
          underline="none"               
          onClick={(e) => e.preventDefault()}
          sx={{
            mt: 1.5,
            display: "inline-block",
            color: "#1a73e8",            
            fontWeight: 400,
            "&:hover": {
              color: "#1a73e8",          
              textDecoration: "none",    
              backgroundColor: "transparent",
              cursor: "pointer",         
            },
          }}
        >
          Forgot email?
        </Link>


        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Not your computer? Use Guest mode to sign in privately.&nbsp;
          <Link
            href="#"
            underline="none"              
            onClick={(e) => e.preventDefault()}
            sx={{
              color: "#1a73e8",           
              fontWeight: 400,
              "&:hover": {
                color: "#1a73e8",         
                textDecoration: "none",   
                backgroundColor: "transparent", 
                cursor: "pointer",        
              },
            }}
          >
            Learn more about using Guest mode
          </Link>
        </Typography>



        {/* Bottom row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
          <Link
            href="#"
            underline="hover"
            onClick={(e) => e.preventDefault()}
            sx={{
              px: 1,
              py: 1,                        
              borderRadius: 1,              
              "&:hover": {
                backgroundColor: "#f6fafe", 
                textDecoration: "none",     
              },
            }}
          >
            Create account
          </Link>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              textTransform: "none",
              px: 3,
              bgcolor: "#1a73e8",
              "&:hover": { bgcolor: "#185abc" },
            }}
          >
            Next
          </Button>
        </Box>


      </Paper>

      
    </Box>
  );
}
