import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';

// This would typically come from an API or database
const assignments = {
  ae: {
    title: 'Account Executive - SMB AI Assignment',
    scenario: [
      'You have 10 minutes to prepare a value proposition for Glade Optics',
      'The merchant, Glade Optics, currently uses a competitor\'s platform',
      'They have 10 employees',
      'They are looking to scale their business internationally',
      'They have concerns about migration complexity',
    ],
    successCriteria: [
      'Uses AI to research the merchant and their industry',
      'Leverages AI to create a compelling value proposition',
      'Utilizes AI to address migration concerns',
      'Demonstrates AI-assisted competitive analysis',
    ],
    failureCriteria: [
      'Attempts to complete the task without AI assistance',
      'Does not leverage AI for research or analysis',
      'Fails to address key merchant concerns',
      'Does not demonstrate AI-first thinking',
    ],
  },
  sdr: {
    title: 'SDR AI Assignment',
    scenario: [
      'This assignment is designed to assess your approach to strategic prospecting and outreach.',
      '',
      'Scenario: Your target is a mid-market energy drink brand (BUM Energy) with $11M annual revenue currently using a competitor platform (WooCommerce). Their main challenges include limited international expansion capabilities, high platform maintenance costs, and complex inventory management. You have access to information such as their company website, social media profiles, industry reports, and competitor analysis tools.',
      '',
      'Task: You have 10 minutes to document a targeted outreach strategy for this prospect.',
      '',
      'Focus on demonstrating your process for gathering and analyzing prospect information, how you would tailor your approach, and how you would identify and articulate key benefits.',
      '',
      'NOTES:',
      'You can use any tool or resource to prepare this strategy.',
      'Please format your response as a one-page word doc summary.'
    ],
    successCriteria: [
      'Uses AI to identify and research prospects',
      'Leverages AI to create personalized messages',
      'Utilizes AI to develop follow-up sequences',
      'Demonstrates AI-assisted research capabilities',
    ],
    failureCriteria: [
      'Attempts manual research without AI',
      'Creates generic outreach messages',
      'Does not leverage AI for personalization',
      'Fails to demonstrate AI-first approach',
    ],
  },
  se: {
    title: 'Solution Engineer AI Assignment',
    scenario: [
      'Coming Soon',
    ],
    successCriteria: [
      'Coming Soon',
    ],
    failureCriteria: [
      'Coming Soon',
    ],
  },
  msm: {
    title: 'Merchant Success Manager AI Assignment',
    scenario: [
      'Coming Soon',
    ],
    successCriteria: [
      'Coming Soon',
    ],
    failureCriteria: [
      'Coming Soon',
    ],
  },
  // Add more role-specific assignments here
};

function Assignment() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [output, setOutput] = useState('');

  const assignment = assignments[roleId];

  if (!assignment) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Assignment not found</Alert>
      </Container>
    );
  }

  const steps = ['Review Assignment', 'Conduct Interview', 'Submit Results'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit to analysis page
      navigate('/analysis', { state: { transcript, output, roleId } });
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {assignment.title}
        </Typography>
      </Paper>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <Paper 
            sx={{ 
              p: 3, 
              mb: 4, 
              bgcolor: '#e6f9f0',
              borderLeft: '6px solid #2afb7cff',
            }}
          >
            <Typography variant="h6" color="text.primary" gutterBottom>
              Important Instructions for Interviewers
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <Typography color="text.primary">
                  Ask the candidate if you can transcribe the call
                </Typography>
              </li>
              <li>
                <Typography color="text.primary">
                  Mention they can use any tool to complete the assignment, but do not mention AI specifically
                </Typography>
              </li>
              <li>
                <Typography color="text.primary">
                  The output can be in any text format (e.g., Word document, Google Doc, etc.)
                </Typography>
              </li>
            </ul>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Scenario
          </Typography>
          <Paper sx={{ p: 3, mb: 4 }}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {assignment.scenario.map((item, index) => (
                <li key={index}>
                  <Typography color="text.primary">{item}</Typography>
                </li>
              ))}
            </ul>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Success Criteria
          </Typography>
          <Paper sx={{ p: 3, mb: 4 }}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {assignment.successCriteria.map((criteria, index) => (
                <li key={index}>
                  <Typography color="text.primary">{criteria}</Typography>
                </li>
              ))}
            </ul>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Failure Criteria
          </Typography>
          <Paper sx={{ p: 3, mb: 4 }}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {assignment.failureCriteria.map((criteria, index) => (
                <li key={index}>
                  <Typography color="text.primary">{criteria}</Typography>
                </li>
              ))}
            </ul>
          </Paper>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              Interview Structure (30 minutes total)
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                1. Introduction and Assignment Overview (10 minutes)
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>
                  <Typography color="text.primary">
                    Welcome the candidate and explain the purpose of the AI-first interview
                  </Typography>
                </li>
                <li>
                  <Typography color="text.primary">
                    Review the assignment scenario and objectives
                  </Typography>
                </li>
                <li>
                  <Typography color="text.primary">
                    Clarify any questions about the task
                  </Typography>
                </li>
              </ul>

              <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ mt: 2 }}>
                2. Candidate Assignment (10 minutes)
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>
                  <Typography color="text.primary">
                    Candidate works independently on the assignment
                  </Typography>
                </li>
              </ul>

              <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ mt: 2 }}>
                3. Discussion and Assessment (10 minutes)
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>
                  <Typography color="text.primary">
                    Discuss the candidate's approach and solution
                  </Typography>
                </li>
                <li>
                  <Typography color="text.primary">
                    Ask about their use of AI tools
                  </Typography>
                </li>
                <li>
                  <Typography color="text.primary">
                    Assess their AI-first thinking and capabilities
                  </Typography>
                </li>
              </ul>
            </Box>
          </Paper>
        </Box>
      )}

      {activeStep === 2 && (
        <Box>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Interview Transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Candidate's Output/Work"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Paper sx={{ p: 3, mb: 4, bgcolor: '#e6f9f0' }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Scoring Framework
            </Typography>
            
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Overall Score (1-10)
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px', marginBottom: '16px' }}>
              <li>
                <Typography color="text.primary">
                  <strong>9-10:</strong> Exceptional AI Integration - Explicit AI tool usage, deep understanding, innovative implementation
                </Typography>
              </li>
              <li>
                <Typography color="text.primary">
                  <strong>7-8:</strong> Strong AI Usage - Clear AI tool usage, good understanding, consistent implementation
                </Typography>
              </li>
              <li>
                <Typography color="text.primary">
                  <strong>5-6:</strong> Basic AI Usage - Basic implementation, limited explanation, some examples
                </Typography>
              </li>
              <li>
                <Typography color="text.primary">
                  <strong>3-4:</strong> Limited AI Usage - Minimal mention, unclear implementation, manual processes
                </Typography>
              </li>
              <li>
                <Typography color="text.primary">
                  <strong>1-2:</strong> No AI Usage - No mention of AI tools, manual approach
                </Typography>
              </li>
            </ul>

            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Evaluation Criteria
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <Typography color="text.primary">
                  <strong>AI Tool Usage (50%):</strong> Explicit mention of tools, specific examples, understanding of capabilities
                </Typography>
              </li>
              <li>
                <Typography color="text.primary">
                  <strong>AI Implementation (30%):</strong> Quality of usage, efficiency, outputs, process improvement
                </Typography>
              </li>
              <li>
                <Typography color="text.primary">
                  <strong>AI Understanding (20%):</strong> Knowledge of capabilities, understanding limitations, tool selection rationale
                </Typography>
              </li>
            </ul>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Note: Must explicitly mention AI tools/usage to score above 4. Detailed analysis will be provided in the results.
            </Typography>
          </Paper>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{ color: 'black', textTransform: 'none', fontWeight: 600, borderRadius: '16px' }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === 2 && (!transcript || !output)}
          sx={{ color: 'black', textTransform: 'none', fontWeight: 600, borderRadius: '16px' }}
        >
          {activeStep === steps.length - 1 ? 'Submit for Analysis' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
}

export default Assignment; 