import React, { useState } from 'react';
import axios from 'axios';
import { Box, FormControl, FormLabel, Select, Input, Button, VStack, Checkbox, useColorMode, Text, Tooltip } from '@chakra-ui/react';

function InputForm({ onAnalysis }) {
  const [platform, setPlatform] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { colorMode } = useColorMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/monitor', { platform, keyword, isLoggedIn });
      onAnalysis(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      backgroundColor={colorMode === 'light' ? 'gray.100' : 'gray.700'}
      padding={6}
      borderRadius="md"
      boxShadow="md"
    >
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Platform 📱</FormLabel>
          <Select
            placeholder="Select Platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            backgroundColor={colorMode === 'light' ? 'white' : 'gray.600'}
            color={colorMode === 'light' ? 'gray.800' : 'white'}
          >
            <option value="twitter">Twitter 🐦</option>
            <option value="instagram">Instagram 📷</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Keyword 🔑</FormLabel>
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword"
            backgroundColor={colorMode === 'light' ? 'white' : 'gray.600'}
            color={colorMode === 'light' ? 'gray.800' : 'white'}
          />
        </FormControl>
        <FormControl>
          <Tooltip label={`I'm logged in to ${platform}`} placement="top">
            <Checkbox
              isChecked={isLoggedIn}
              onChange={(e) => setIsLoggedIn(e.target.checked)}
              mr={2}
            >
              <Text>Logged in</Text>
            </Checkbox>
          </Tooltip>
        </FormControl>
        <Button
          type="submit"
          colorScheme={colorMode === 'light' ? 'blue' : 'teal'}
          width="full"
          fontSize="lg"
          fontWeight="bold"
        >
          Monitor 🔍
        </Button>
      </VStack>
    </Box>
  );
}

export default InputForm;