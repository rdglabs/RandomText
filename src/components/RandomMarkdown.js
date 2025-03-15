import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';

const RandomMarkdown = () => {
  const [randomValue, setRandomValue] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchRandomMarkdownValue = async () => {
      try {
        console.log('Fetching markdown file...');
        const response = await fetch('/RandomText/data.md'); // Path to your Markdown file

        if (!response.ok) {
          throw new Error(`Failed to fetch markdown file: ${response.statusText}`);
        }

        const markdownText = await response.text();
        console.log('Markdown content:', markdownText); // Log the entire markdown content

        // Extract list items using a more flexible regular expression
        const listItems = markdownText.match(/^\s*- (.*?)(?=\n|$)/gm); // Match lines starting with '-'

        if (!listItems || listItems.length === 0) {
          throw new Error('No list items found in the markdown file.');
        }

        console.log('Matched list items:', listItems); // Log the matched list items

        const values = listItems.map(item => item.replace(/^\s*- /, '').trim()); // Clean the extracted items
        console.log('Extracted values:', values); // Log the extracted values

        // Check if we're getting the expected list values
        if (values.length === 0) {
          throw new Error('No valid list items found after cleaning.');
        }

        // Debugging: log the length of the values array to check if all items are included
        console.log('Total items in list:', values.length);

        // Randomly select one value from the list
        const randomValue = values[Math.floor(Math.random() * values.length)];
        console.log('Random value selected:', randomValue); // Log the random value

        setRandomValue(randomValue);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMarkdownValue();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return <p className="random-markdown">{randomValue}</p>;
};

export default RandomMarkdown;
