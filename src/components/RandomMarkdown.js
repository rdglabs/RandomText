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

        // Extract list items using a regular expression
        const listItems = markdownText.match(/^\s*- (.*?)(?=\n|$)/gm); // Match lines starting with '-'

        if (!listItems || listItems.length === 0) {
          throw new Error('No list items found in the markdown file.');
        }

        console.log('Matched list items:', listItems); // Log the matched list items

        // Clean the extracted list items and check for images or text
        const values = listItems.map(item => item.replace(/^\s*- /, '').trim());
        console.log('Extracted values:', values); // Log the extracted values

        if (values.length === 0) {
          throw new Error('No valid list items found after cleaning.');
        }

        // Randomly select one value from the list
        const randomValue = values[Math.floor(Math.random() * values.length)];
        console.log('Random value selected:', randomValue); // Log the random value

        // Check if the selected value is an image URL
        const imageRegex = /!\[.*?\]\((.*?)\)/; // Regex for markdown image syntax
        const isImage = imageRegex.test(randomValue);

        if (isImage) {
          const imageUrl = randomValue.match(imageRegex)[1];
          setRandomValue({ type: 'image', url: imageUrl });
        } else {
          setRandomValue({ type: 'text', content: randomValue });
        }
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

  return (
    <div className="random-markdown">
      {randomValue ? (
        randomValue.type === 'image' ? (
          <img src={randomValue.url} alt="Random from Markdown" />
        ) : (
          <p>{randomValue.content}</p>
        )
      ) : (
        <p>No valid content found.</p>
      )}
    </div>
  );
};

export default RandomMarkdown;
