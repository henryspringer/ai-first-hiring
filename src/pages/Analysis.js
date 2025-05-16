import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';

function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper functions for generating analysis text
  const generateRationale = (score, counts, examples) => {
    if (score >= 9) return "Exceptional AI integration with clear examples of tool usage and implementation";
    if (score >= 7) return "Strong AI usage with specific examples of implementation";
    if (score >= 5) return "Basic AI usage with some implementation examples";
    if (score >= 3) return "Limited AI usage with minimal implementation";
    return "No significant AI usage detected";
  };

  const generateJustification = (score, counts, examples) => {
    const parts = [];
    if (examples.tools.length > 0) {
      parts.push(`Used AI tools: ${examples.tools.join(', ')}`);
    }
    if (examples.actions.length > 0) {
      parts.push(`Implemented AI for: ${examples.actions.join(', ')}`);
    }
    if (examples.concepts.length > 0) {
      parts.push(`Demonstrated understanding of: ${examples.concepts.join(', ')}`);
    }
    return parts.join(". ");
  };

  const generateStrengths = (counts, examples) => {
    const strengths = [];
    if (examples.tools.length > 0) {
      strengths.push({
        strength: "Effective AI Tool Usage",
        example: examples.tools[0],
        impact: "Demonstrated practical application of AI tools",
        scoringLevel: getScoringLevel(counts.tools)
      });
    }
    if (examples.actions.length > 0) {
      strengths.push({
        strength: "Clear Implementation Strategy",
        example: examples.actions[0],
        impact: "Showed systematic use of AI",
        scoringLevel: getScoringLevel(counts.actions)
      });
    }
    return strengths;
  };

  const generateImprovements = (counts, examples) => {
    const improvements = [];
    if (examples.tools.length < 2) {
      improvements.push({
        area: "AI Tool Diversity",
        currentState: "Limited tool variety",
        targetLevel: "7-8",
        recommendation: "Explore additional AI tools for different tasks",
        tools: "Consider expanding beyond current tool usage"
      });
    }
    if (examples.actions.length < 2) {
      improvements.push({
        area: "AI Implementation",
        currentState: "Limited implementation examples",
        targetLevel: "7-8",
        recommendation: "Practice implementing AI in different scenarios",
        tools: "Focus on practical applications"
      });
    }
    return improvements;
  };

  const getScoringLevel = (score) => {
    if (score >= 9) return "9-10";
    if (score >= 7) return "7-8";
    if (score >= 5) return "5-6";
    if (score >= 3) return "3-4";
    return "1-2";
  };

  const generateImpact = (score, type) => {
    if (score >= 9) return `Exceptional ${type} with comprehensive understanding`;
    if (score >= 7) return `Strong ${type} with clear examples`;
    if (score >= 5) return `Basic ${type} with some examples`;
    if (score >= 3) return `Limited ${type} with minimal examples`;
    return `No significant ${type} detected`;
  };

  const analyzeTranscript = useCallback((transcript, output, roleId) => {
    // Define AI-related keywords and their categories with context
    const aiKeywords = {
      tools: [
        { term: 'chatgpt', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'gpt', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'claude', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'bard', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'copilot', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'github copilot', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'chat.shopify.io', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'cursor', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'claude code', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'proxy', context: ['used', 'using', 'utilized', 'with'] },
        { term: 'ai', context: ['used', 'using', 'utilized', 'with', 'for', 'to'] }
      ],
      actions: [
        { term: 'prompt', context: ['created', 'used', 'wrote', 'with'] },
        { term: 'generate', context: ['used to', 'to', 'for'] },
        { term: 'analyze', context: ['used to', 'to', 'for'] },
        { term: 'summarize', context: ['used to', 'to', 'for'] },
        { term: 'research', context: ['used to', 'to', 'for'] },
        { term: 'automate', context: ['used to', 'to', 'for'] },
        { term: 'optimize', context: ['used to', 'to', 'for'] },
        { term: 'enhance', context: ['used to', 'to', 'for'] },
        { term: 'improve', context: ['used to', 'to', 'for'] },
        { term: 'streamline', context: ['used to', 'to', 'for'] }
      ],
      concepts: [
        { term: 'artificial intelligence', context: ['used', 'using', 'with', 'for'] },
        { term: 'machine learning', context: ['used', 'using', 'with', 'for'] },
        { term: 'ml', context: ['used', 'using', 'with', 'for'] },
        { term: 'natural language', context: ['used', 'using', 'with', 'for'] },
        { term: 'nlp', context: ['used', 'using', 'with', 'for'] },
        { term: 'automation', context: ['used', 'using', 'with', 'for'] },
        { term: 'algorithm', context: ['used', 'using', 'with', 'for'] }
      ]
    };

    // Convert text to lowercase for case-insensitive matching
    const text = (transcript + ' ' + output).toLowerCase();
    
    // Count keyword occurrences with context
    const keywordCounts = {
      tools: 0,
      actions: 0,
      concepts: 0
    };

    const foundExamples = {
      tools: [],
      actions: [],
      concepts: []
    };

    // Count occurrences of each keyword with context
    Object.entries(aiKeywords).forEach(([category, keywords]) => {
      keywords.forEach(({ term, context }) => {
        // Look for the term with its context
        context.forEach(ctx => {
          const regex = new RegExp(`\\b${ctx}\\s+${term}\\b|\\b${term}\\s+${ctx}\\b`, 'gi');
          const matches = text.match(regex);
          if (matches) {
            keywordCounts[category] += matches.length;
            foundExamples[category].push(...matches);
          }
        });
      });
    });

    // Calculate scores based on keyword presence and context
    const toolScore = calculateToolScore(keywordCounts.tools, foundExamples.tools);
    const actionScore = calculateActionScore(keywordCounts.actions, foundExamples.actions);
    const conceptScore = calculateConceptScore(keywordCounts.concepts, foundExamples.concepts);

    // Calculate overall score with weights
    const overallScore = Math.round(
      (toolScore * 0.5) + // 50% weight for tool usage
      (actionScore * 0.3) + // 30% weight for implementation
      (conceptScore * 0.2) // 20% weight for understanding
    );

    // Determine scoring level
    let scoringLevel;
    if (overallScore >= 9) scoringLevel = "9-10";
    else if (overallScore >= 7) scoringLevel = "7-8";
    else if (overallScore >= 5) scoringLevel = "5-6";
    else if (overallScore >= 3) scoringLevel = "3-4";
    else scoringLevel = "1-2";

    // Generate analysis based on scores and examples
    return {
      overallScore,
      rationale: generateRationale(overallScore, keywordCounts, foundExamples),
      scoringLevel,
      justification: generateJustification(overallScore, keywordCounts, foundExamples),
      aiUsage: keywordCounts.tools > 0 ? "Yes" : "No",
      keyStrengths: generateStrengths(keywordCounts, foundExamples),
      areasForImprovement: generateImprovements(keywordCounts, foundExamples),
      roleId,
      detailedAnalysis: {
        "AI Tool Usage": {
          assessment: toolScore,
          scoringLevel: getScoringLevel(toolScore),
          evidence: generateEvidence("tool", foundExamples.tools),
          impact: generateImpact(toolScore, "tool usage")
        },
        "AI Implementation": {
          assessment: actionScore,
          scoringLevel: getScoringLevel(actionScore),
          evidence: generateEvidence("implementation", foundExamples.actions),
          impact: generateImpact(actionScore, "implementation")
        },
        "AI Understanding": {
          assessment: conceptScore,
          scoringLevel: getScoringLevel(conceptScore),
          evidence: generateEvidence("concept", foundExamples.concepts),
          impact: generateImpact(conceptScore, "understanding")
        }
      }
    };
  }, []);

  // Helper functions for score calculation
  const calculateToolScore = (count, examples) => {
    if (count === 0) return 1;
    if (count >= 3) return 10;
    if (count >= 2) return 8;
    return 5;
  };

  const calculateActionScore = (count, examples) => {
    if (count === 0) return 1;
    if (count >= 4) return 10;
    if (count >= 2) return 7;
    return 4;
  };

  const calculateConceptScore = (count, examples) => {
    if (count === 0) return 1;
    if (count >= 3) return 10;
    if (count >= 2) return 7;
    return 4;
  };

  const generateEvidence = (type, examples) => {
    if (examples.length === 0) return `No ${type} examples found`;
    return `Found ${examples.length} instances of AI ${type} usage: ${examples.join(', ')}`;
  };

  useEffect(() => {
    // Simulate analysis processing
    setTimeout(() => {
      const { transcript, output, roleId } = location.state || {};
      
      if (!transcript || !output) {
        navigate('/');
        return;
      }

      // Analyze transcript and output
      const score = analyzeTranscript(transcript, output, roleId);
      setAnalysis(score);
      setLoading(false);
    }, 2000);
  }, [location.state, navigate, analyzeTranscript]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Readiness Analysis
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Overall Score: {analysis.overallScore}/10
        </Typography>
        <Typography variant="body1" color="text.primary" paragraph>
          {analysis.rationale}
        </Typography>
        <Typography variant="subtitle1" color="text.primary" gutterBottom>
          Scoring Level: {analysis.scoringLevel}
        </Typography>
        <Typography variant="body1" color="text.primary" paragraph>
          {analysis.justification}
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Key Strengths
        </Typography>
        {analysis.keyStrengths.map((strength, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              {strength.strength}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Example: {strength.example}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Impact: {strength.impact}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Areas for Improvement
        </Typography>
        {analysis.areasForImprovement.map((area, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              {area.area}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current State: {area.currentState}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recommendation: {area.recommendation}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suggested Tools: {area.tools}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Detailed Analysis
        </Typography>
        {Object.entries(analysis.detailedAnalysis).map(([criterion, details]) => (
          <Box key={criterion} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.primary">
              {criterion}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assessment: {details.assessment}/10
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Evidence: {details.evidence}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Impact: {details.impact}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <Button
          variant="contained"
          onClick={() => window.print()}
        >
          Print Report
        </Button>
      </Box>
    </Container>
  );
}

export default Analysis; 