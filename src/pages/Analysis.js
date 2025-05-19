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
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper functions for generating analysis text
  const generateRationale = (score, counts, examples) => {
    // Narrative summary for leadership
    if (score >= 9) {
      return (
        "Exceptional AI-first approach. The candidate demonstrated reflexive and advanced use of AI tools throughout the interview. " +
        (examples.tools.length > 0 ? `They explicitly referenced tools such as: ${examples.tools.slice(0, 3).join(', ')}. ` : '') +
        (examples.actions.length > 0 ? `They described using AI for tasks like: ${examples.actions.slice(0, 3).join(', ')}. ` : '') +
        "Their workflow shows deep comfort with leveraging AI to accelerate and improve their work."
      );
    }
    if (score >= 7) {
      return (
        "Strong AI usage. The candidate clearly integrates AI tools into their workflow, mentioning specific examples such as " +
        (examples.tools.length > 0 ? `${examples.tools.slice(0, 2).join(', ')}` : 'AI tools') +
        ". They provided details on how they use AI to research, generate, or improve outputs, and showed a solid understanding of AI's value."
      );
    }
    if (score >= 5) {
      return (
        "Basic AI usage. The candidate referenced AI tools or concepts, but examples were limited or generic. There is some evidence of implementation, but opportunities remain to deepen their AI-first approach."
      );
    }
    if (score >= 3) {
      return (
        "Limited AI usage. The candidate made minimal mention of AI tools or concepts, and did not provide clear examples of implementation. Manual processes were more prominent than AI-driven approaches."
      );
    }
    return "No significant AI usage detected. The candidate did not mention or demonstrate the use of AI tools or concepts.";
  };

  const generateJustification = (score, counts, examples) => {
    // Narrative evidence summary
    let output = '';
    if (examples.tools.length > 0) {
      output += `AI tool mentions: ${examples.tools.slice(0, 3).join(', ')}. `;
    }
    if (examples.actions.length > 0) {
      output += `AI implementation examples: ${examples.actions.slice(0, 3).join(', ')}. `;
    }
    if (examples.concepts.length > 0) {
      output += `AI concepts referenced: ${examples.concepts.slice(0, 2).join(', ')}. `;
    }
    if (!output) {
      output = 'No explicit AI tool usage or implementation was referenced.';
    }
    return output.trim();
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
        // ChatGPT and variants
        { term: /chat\s*-?gpt|gpt-4|gpt4|gpt 4|open\s*ai/i, context: ['used', 'using', 'utilized', 'with', 'ran', 'asked', 'leveraged', 'pasted', 'generated', 'wrote', 'summarized', 'analyzed'] },
        // Claude and variants
        { term: /claude|claude 2|anthropic/i, context: ['used', 'using', 'utilized', 'with'] },
        // Bard and variants
        { term: /bard|google bard/i, context: ['used', 'using', 'utilized', 'with'] },
        // Copilot and variants
        { term: /co\s*-?pilot|copilot|github copilot|ms copilot|microsoft copilot/i, context: ['used', 'using', 'utilized', 'with'] },
        // Cursor
        { term: /cursor|cursor ai/i, context: ['used', 'using', 'utilized', 'with'] },
        // Perplexity
        { term: /perplexity|perplexity ai/i, context: ['used', 'using', 'utilized', 'with'] },
        // Llama
        { term: /llama|llama 2|meta llama/i, context: ['used', 'using', 'utilized', 'with'] },
        // Gemini
        { term: /gemini|google gemini/i, context: ['used', 'using', 'utilized', 'with'] },
        // Company/Platform-specific
        { term: /salesforce einstein|hubspot ai|notion ai|google workspace ai|microsoft 365 copilot|slack ai|zoom ai|figma ai|canva ai|shopify magic|chat\.shopify\.io/i, context: ['used', 'using', 'utilized', 'with'] },
        // Generic
        { term: /ai assistant|ai chatbot|ai model|ai agent|virtual assistant|bot/i, context: ['used', 'using', 'utilized', 'with'] },
        // Misspellings and abbreviations
        { term: /chagpt|chaptgpt|chapt gpt|co-pilot|co pilot|bard ai|claud|cloud/i, context: ['used', 'using', 'utilized', 'with'] },
        // Simple AI
        { term: /ai|a\.i\./i, context: ['used', 'using', 'utilized', 'with', 'for', 'to', 'ran', 'asked', 'leveraged', 'pasted', 'generated', 'wrote', 'summarized', 'analyzed'] },
      ],
      actions: [
        { term: /prompt|prompt engineering|prompted|prompting/i, context: ['created', 'used', 'wrote', 'with'] },
        { term: /generate|generated|generating/i, context: ['used to', 'to', 'for'] },
        { term: /analyze|analyzed|analyzing/i, context: ['used to', 'to', 'for'] },
        { term: /summarize|summarized|summarizing/i, context: ['used to', 'to', 'for'] },
        { term: /research|researched|researching/i, context: ['used to', 'to', 'for'] },
        { term: /automate|automated|automating|automation/i, context: ['used to', 'to', 'for'] },
        { term: /optimize|optimized|optimizing/i, context: ['used to', 'to', 'for'] },
        { term: /enhance|enhanced|enhancing/i, context: ['used to', 'to', 'for'] },
        { term: /improve|improved|improving/i, context: ['used to', 'to', 'for'] },
        { term: /streamline|streamlined|streamlining/i, context: ['used to', 'to', 'for'] },
        { term: /auto-?generate|auto reply|auto summarize/i, context: ['used', 'using', 'utilized', 'with'] },
      ],
      concepts: [
        { term: /artificial intelligence|machine learning|ml|deep learning|neural network|large language model|llm|natural language|nlp|algorithm/i, context: ['used', 'using', 'with', 'for'] },
        { term: /ai-powered|ai-driven|ai-enabled|powered by ai|using an llm|using a chatbot/i, context: ['used', 'using', 'with', 'for'] },
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
        context.forEach(ctx => {
          let matches = [];
          // Allow up to 3 words between context and term (e.g., 'used AI', 'had AI create', 'used AI to')
          if (term instanceof RegExp) {
            // For regex terms like chatgpt/chat gpt
            const regex = new RegExp(`\\b${ctx}\\b(?:\\W+\\w+){0,3}?\\W+${term.source}\\b`, 'gi');
            matches = text.match(regex);
            if (matches) {
              keywordCounts[category] += matches.length;
              foundExamples[category].push(...matches);
            }
          } else {
            const regex = new RegExp(`\\b${ctx}\\b(?:\\W+\\w+){0,3}?\\W+${term}\\b`, 'gi');
            matches = text.match(regex);
            if (matches) {
              keywordCounts[category] += matches.length;
              foundExamples[category].push(...matches);
            }
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

    // Fallback: If no AI evidence found, force lowest score and rationale
    if (
      keywordCounts.tools === 0 &&
      keywordCounts.actions === 0 &&
      keywordCounts.concepts === 0
    ) {
      return {
        overallScore: 1,
        rationale: "No significant AI usage detected. The candidate did not mention or demonstrate the use of AI tools or concepts.",
        scoringLevel: "1-2",
        justification: "No explicit AI tool usage or implementation was referenced.",
        aiUsage: "No",
        keyStrengths: [],
        areasForImprovement: [
          {
            area: "AI Tool Usage",
            currentState: "No AI tools mentioned",
            recommendation: "Explore and leverage AI tools to improve workflow and productivity."
          }
        ],
        roleId,
        foundExamples,
        detailedAnalysis: {
          "AI Tool Usage": {
            assessment: 1,
            scoringLevel: "1-2",
            evidence: "No tool usage found.",
            impact: "No AI tool usage detected."
          },
          "AI Implementation": {
            assessment: 1,
            scoringLevel: "1-2",
            evidence: "No implementation found.",
            impact: "No AI implementation detected."
          },
          "AI Understanding": {
            assessment: 1,
            scoringLevel: "1-2",
            evidence: "No AI concepts found.",
            impact: "No AI understanding detected."
          }
        }
      };
    }

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
      
      if (!transcript && !output) {
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
            AI Readiness Analysis
          </Typography>
          <Typography variant="h5" sx={{ color: 'black', fontWeight: 500, mb: 2 }}>
            Accelerate Shopify's Growth with AI-First Talent
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0, ml: { md: 4 }, mt: { xs: 4, md: 0 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RocketLaunchIcon sx={{ fontSize: 100, color: '#2afb7cff' }} />
        </Box>
      </Paper>

      {/* Overall Score Card */}
      <Paper sx={{
        p: 4,
        mb: 4,
        borderRadius: 2,
        bgcolor: '#e6f9f0',
        borderLeft: '8px solid #2afb7cff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <Box sx={{
          bgcolor: '#2afb7cff',
          color: 'black',
          borderRadius: '16px',
          px: 4,
          py: 2,
          fontWeight: 700,
          fontSize: 36,
          mr: 4,
          minWidth: 120,
          textAlign: 'center',
          boxShadow: 2,
        }}>
          {analysis.overallScore}/10
        </Box>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
            Overall Score
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI Readiness
          </Typography>
        </Box>
      </Paper>

      {/* Summary Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Summary
        </Typography>
        <Typography variant="body1" color="text.primary" paragraph>
          {analysis.rationale}
        </Typography>
      </Paper>

      {/* Keyword Detection Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Keyword Detection
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {analysis.foundExamples?.tools?.length > 0 && (
            <li>
              <strong>AI tool mentions:</strong> {analysis.foundExamples.tools.slice(0, 5).join(', ')}
            </li>
          )}
          {analysis.foundExamples?.actions?.length > 0 && (
            <li>
              <strong>AI actions:</strong> {analysis.foundExamples.actions.slice(0, 5).join(', ')}
            </li>
          )}
          {analysis.foundExamples?.concepts?.length > 0 && (
            <li>
              <strong>AI concepts:</strong> {analysis.foundExamples.concepts.slice(0, 5).join(', ')}
            </li>
          )}
          {(!analysis.foundExamples?.tools?.length && !analysis.foundExamples?.actions?.length && !analysis.foundExamples?.concepts?.length) && (
            <li>No significant AI keywords detected.</li>
          )}
        </ul>
      </Paper>

      {/* Scoring Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Scoring
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>AI Tool Usage Score: <strong>{analysis.detailedAnalysis['AI Tool Usage'].assessment}/10</strong></li>
          <li>AI Implementation Score: <strong>{analysis.detailedAnalysis['AI Implementation'].assessment}/10</strong></li>
          <li>AI Understanding Score: <strong>{analysis.detailedAnalysis['AI Understanding'].assessment}/10</strong></li>
          <li>The more times these are mentioned in the right context, the higher the scores for tool usage and implementation.</li>
        </ul>
      </Paper>

      {/* Output Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Output
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {analysis.justification.split('. ').map((point, idx) => (
            point.trim() && <li key={idx}>{point.trim().replace(/\.$/, '')}.</li>
          ))}
        </ul>
      </Paper>

      {/* Strengths and Evidence Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Strengths and Evidence
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {analysis.keyStrengths && analysis.keyStrengths.length > 0 ? (
            analysis.keyStrengths.map((strength, idx) => (
              <li key={idx}>
                <strong>{strength.strength}:</strong> {strength.example} <em>({strength.impact})</em>
              </li>
            ))
          ) : <li>No explicit strengths detected.</li>}
        </ul>
      </Paper>

      {/* Areas for Improvement Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          Areas for Improvement
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {analysis.areasForImprovement && analysis.areasForImprovement.length > 0 ? (
            analysis.areasForImprovement.map((area, idx) => (
              <li key={idx}>
                <strong>{area.area}:</strong> {area.recommendation} <em>({area.currentState})</em>
              </li>
            ))
          ) : <li>No major areas for improvement detected.</li>}
        </ul>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          sx={{ color: 'black', fontWeight: 600, borderRadius: '16px', textTransform: 'none' }}
          onClick={() => navigate('/')}
        >
          Back to Home Page
        </Button>
      </Box>
    </Container>
  );
}

export default Analysis; 