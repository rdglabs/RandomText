import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const RandomMarkdown = () => {
  const [randomItem, setRandomItem] = useState(null); // Store the randomly selected item
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  const fetchRandomMarkdownValue = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching markdown file...');
      const response = await fetch('/RandomText/data.md'); // Path to your Markdown file

      if (!response.ok) {
        throw new Error(`Failed to fetch markdown file: ${response.statusText}`);
      }

      const markdownText = await response.text();
      console.log('Markdown content:', markdownText); // Log the entire markdown content

      // Extract individual list items, preserving formatting
      const listItems = markdownText.split(/\n(?=- )/).map(item => item.replace(/^-\s*/, '').trim());
      
      if (!listItems || listItems.length === 0) {
        throw new Error('No list items found in the markdown file.');
      }

      console.log('Matched list items:', listItems); // Log the matched list items

      // Randomly select one item from the list
      const randomIndex = Math.floor(Math.random() * listItems.length);
      const selectedItem = listItems[randomIndex];

      setRandomItem(selectedItem);
    } catch (error) {
      console.error('Error:', error);
      setError(error?.message || error.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMarkdownValue();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!randomItem) {
    return <p>No valid content found.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
      <ReactMarkdown>{randomItem}</ReactMarkdown>
      <button onClick={fetchRandomMarkdownValue} style={{ marginTop: '20px', padding: '10px', fontSize: '16px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: 'white' }}>
        Don't Click Me
      </button>
    </div>
  );
};

export default RandomMarkdown;
