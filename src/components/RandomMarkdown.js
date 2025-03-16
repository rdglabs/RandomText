import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import React, { useState, useEffect } from 'react';

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

      // Extract list items using a regular expression
      const listItems = markdownText.match(/^\s*- (.*?)(?=\n|$)/gm); // Match lines starting with '-'

      if (!listItems || listItems.length === 0) {
        throw new Error('No list items found in the markdown file.');
      }

      console.log('Matched list items:', listItems); // Log the matched list items

      // Clean the extracted list items and determine if they are text, images, or links
      const parsedItems = listItems.map(item => {
        const cleanedItem = item.replace(/^\s*- /, '').trim();

        // Regex for images
        const imageRegex = /!\[.*?\]\((.*?)\)/g;
        // Regex for links
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        const elements = [];
        let lastIndex = 0;
        let match;

        while ((match = imageRegex.exec(cleanedItem)) !== null) {
          const textBeforeImage = cleanedItem.substring(lastIndex, match.index).trim();
          if (textBeforeImage) {
            elements.push({ type: 'text', content: textBeforeImage });
          }
          elements.push({ type: 'image', url: match[1] });
          lastIndex = imageRegex.lastIndex;
        }

        let remainingText = cleanedItem.substring(lastIndex).trim();
        if (remainingText) {
          // Process links within text
          let linkMatch;
          let processedText = [];
          lastIndex = 0;
          while ((linkMatch = linkRegex.exec(remainingText)) !== null) {
            const textBeforeLink = remainingText.substring(lastIndex, linkMatch.index).trim();
            if (textBeforeLink) {
              processedText.push({ type: 'text', content: textBeforeLink });
            }
            processedText.push({ type: 'link', content: linkMatch[1], url: linkMatch[2] });
            lastIndex = linkRegex.lastIndex;
          }
          const finalText = remainingText.substring(lastIndex).trim();
          if (finalText) {
            processedText.push({ type: 'text', content: finalText });
          }
          elements.push(...processedText);
        }

        return elements;
      });

      console.log('Parsed list items:', parsedItems); // Log the parsed items

      // Randomly select one item from the list
      const randomIndex = Math.floor(Math.random() * parsedItems.length);
      setRandomItem(parsedItems[randomIndex]); // Set the randomly selected item
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
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

  if (!randomItem || randomItem.length === 0) {
    return <p>No valid content found.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
      {randomItem.map((subItem, index) => (
        <div key={index}>
          {subItem.type === 'image' ? (
            <img src={subItem.url} alt={`Image ${index}`} style={{ maxWidth: '100%', height: 'auto', margin: '10px' }} />
          ) : subItem.type === 'link' ? (
            <a href={subItem.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF', textDecoration: 'underline', margin: '10px', fontSize: '18px' }}>
              {subItem.content}
            </a>
          ) : (
            <p style={{ margin: '10px', fontSize: '18px' }}>{subItem.content}</p>
          )}
        </div>
      ))}
      <button onClick={fetchRandomMarkdownValue} style={{ marginTop: '20px', padding: '10px', fontSize: '16px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: 'white' }}>
        Don't Click Me
      </button>
    </div>
  );
};

export default RandomMarkdown;