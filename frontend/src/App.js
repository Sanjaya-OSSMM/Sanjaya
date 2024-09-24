import React, { useState } from 'react';
import { ChakraProvider, Box, Heading, VStack, useColorMode, IconButton, Flex, Text } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();

  const handleAnalysis = (result) => {
    setAnalysisResult(result);
  };

  return (
    <ChakraProvider colorMode={colorMode}>
      <Box maxWidth="1200px" margin="0 auto" padding={8}>
        <VStack spacing={8} align="stretch">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="2xl" textAlign="center">
              Social Media Monitoring Tool 🔍
            </Heading>
            <IconButton
              aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
          </Box>
          <InputForm onAnalysis={handleAnalysis} />
          {analysisResult && <Dashboard result={analysisResult} />}
          <Flex
            as="footer"
            width="100%"
            justifyContent="center"
            alignItems="center"
            padding={4}
            borderTopWidth={1}
            borderTopColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
          >
            <Text>Built with Chakra UI with <span role="img" aria-label="love">❤️</span> by Rasenkai &copy; 2024</Text>
          </Flex>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;