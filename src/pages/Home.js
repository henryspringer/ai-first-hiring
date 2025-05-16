import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// This would typically come from an API or database
const roles = [
  {
    id: 'ae',
    title: 'Account Executive - SMB',
    description: 'Sales role focused on closing deals and managing client relationships',
    assignmentPreview: 'Prepare a value proposition for Glade Optics, a 10-person company looking to scale internationally while managing migration complexity.',
    icon: <WorkOutlineIcon sx={{ fontSize: 48, color: '#2afb7cff' }} />,
    category: 'Sales',
  },
  {
    id: 'sdr',
    title: 'Sales Development Representative',
    description: 'Outbound prospecting and lead qualification',
    assignmentPreview: 'Create personalized outreach for Stance, a company facing inventory management and international expansion challenges.',
    icon: <PhoneInTalkIcon sx={{ fontSize: 48, color: '#2afb7cff' }} />,
    category: 'Sales',
  },
  {
    id: 'se',
    title: 'Solution Engineer',
    description: 'Technical sales support and solution architecture',
    assignmentPreview: 'Coming Soon',
    icon: <BuildCircleIcon sx={{ fontSize: 48, color: '#2afb7cff' }} />,
    category: 'Support',
  },
  {
    id: 'msm',
    title: 'Merchant Success Manager',
    description: 'Customer success and relationship management',
    assignmentPreview: 'Coming Soon',
    icon: <SupervisorAccountIcon sx={{ fontSize: 48, color: '#2afb7cff' }} />,
    category: 'Support',
  },
];

const processSteps = [
  {
    number: 1,
    title: 'Select Assignment',
    description: 'Choose the appropriate AI-first assignment based on the role you\'re hiring for',
  },
  {
    number: 2,
    title: 'Conduct Interview',
    description: 'Run the 10-minute assignment with the candidate, observing their natural use of AI tools',
  },
  {
    number: 3,
    title: 'Analyze Results',
    description: 'Use our analysis tool to score the candidate\'s AI readiness on a scale of 1-10',
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          bgcolor: '#e6f9f0', // soft green
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'black', fontWeight: 700 }}>
            AI First Hiring
          </Typography>
          <Typography variant="h5" sx={{ color: 'black', fontWeight: 500, mb: 2 }}>
            Accelerate Shopify's Growth with AI-First Talent
          </Typography>
          <Typography variant="body1" sx={{ color: 'black', maxWidth: 600 }}>
            Welcome to the AI First Hiring Portal. This tool helps you assess candidates' natural inclination to leverage AI tools in their work. Through structured 10-minute assignments, you'll be able to identify candidates who demonstrate AI-first thinking and can effectively use AI to enhance their productivity.
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0, ml: { md: 4 }, mt: { xs: 4, md: 0 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RocketLaunchIcon sx={{ fontSize: 100, color: '#2afb7cff' }} />
        </Box>
      </Paper>

      {/* Process Steps */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={3}>
          {processSteps.map((step) => (
            <Grid item xs={12} md={4} key={step.number}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{step.number}</Typography>
                </Box>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Typography variant="h5" color="text.primary" gutterBottom>
        Available Roles
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        {roles.map((role) => (
          <Grid item xs={12} sm={6} key={role.id}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: '24px',
                border: '1px solid #e0e0e0',
                background: '#fff',
                overflow: 'hidden',
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ height: 100, background: '#e6f9f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {role.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black', fontWeight: 700 }}>
                  {role.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'black', mb: 2 }}
                >
                  {role.assignmentPreview}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                  <Button 
                    variant="text" 
                    endIcon={<span style={{ fontSize: 18, marginLeft: 4 }}>→</span>} 
                    sx={{ color: 'black', textTransform: 'none', fontWeight: 600 }}
                    onClick={() => navigate(`/assignment/${role.id}`)}
                  >
                    View Assignment
                  </Button>
                  <Box sx={{
                    border: '1.5px solid #2afb7cff',
                    borderRadius: '16px',
                    px: 2,
                    py: 0.5,
                    color: '#2afb7cff',
                    fontWeight: 500,
                    fontSize: 14,
                    background: 'white',
                  }}>
                    {role.category}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home; 