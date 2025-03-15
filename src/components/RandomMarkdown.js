import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import React, { useState, useEffect } from 'react';

const RandomMarkdown = () => {
  const [randomItem, setRandomItem] = useState(null); // Store the randomly selected item
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

        // Clean the extracted list items and determine if they are text or images
        const parsedItems = listItems.map(item => {
          const cleanedItem = item.replace(/^\s*- /, '').trim();

          // Separate text from images using a regular expression to check for images
          const imageRegex = /!\[.*?\]\((.*?)\)/;
          const textWithImage = [];

          // Check if there is an image and split the item into parts
          if (imageRegex.test(cleanedItem)) {
            // Split the text from the image
            const imageUrl = cleanedItem.match(imageRegex)[1];
            const textBeforeImage = cleanedItem.replace(imageRegex, '').trim();
            textWithImage.push({ type: 'text', content: textBeforeImage });
            textWithImage.push({ type: 'image', url: imageUrl });
          } else {
            textWithImage.push({ type: 'text', content: cleanedItem });
          }

          return textWithImage;
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
    <div className="random-markdown">
      {randomItem.map((subItem, index) => (
        <div key={index}>
          {subItem.type === 'image' ? (
            <img src={subItem.url} alt={`Image ${index}`} />
          ) : (
            <p>{subItem.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RandomMarkdown;
