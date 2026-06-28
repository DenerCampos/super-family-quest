import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

interface HealthMarkdownContentProps {
  content: string;
  textPrimary: string;
}

export function HealthMarkdownContent({
  content,
  textPrimary,
}: HealthMarkdownContentProps) {
  return (
    <Box
      color={textPrimary}
      fontSize="sm"
      lineHeight="1.7"
      sx={{
        '& h1, & h2, & h3': {
          fontWeight: 'bold',
          color: textPrimary,
          mt: 4,
          mb: 2,
        },
        '& h2': { fontSize: 'md' },
        '& h3': { fontSize: 'sm' },
        '& p': { mb: 2 },
        '& ul, & ol': { pl: 4, mb: 2 },
        '& li': { mb: 1 },
        '& strong': { fontWeight: 'bold', color: textPrimary },
        '& em': { fontStyle: 'italic' },
      }}
    >
      <ReactMarkdown
        allowedElements={[
          'h1',
          'h2',
          'h3',
          'p',
          'ul',
          'ol',
          'li',
          'strong',
          'em',
          'blockquote',
        ]}
        unwrapDisallowed
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
