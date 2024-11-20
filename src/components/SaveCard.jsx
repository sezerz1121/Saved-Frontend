import React from 'react';
import { MdCopyAll } from 'react-icons/md';

const SaveCard = ({ content, time, imageUrl }) => {
  // Function to check if the content is a URL
  const isValidUrl = (text) => {
    const urlRegex = /^(https?:\/\/[^\s]+)$/;
    return urlRegex.test(text);
  };

  // Copy content to clipboard
  const copyContentToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .catch((error) => console.error('Failed to copy content:', error));
  };

  return (
    <div className="saveCardCantainer">
      {/* Top section with time and copy button */}
      <div className="saveCardTop">
        <div className="saveCardTopText">{time}</div>
        <div onClick={copyContentToClipboard}>
          <MdCopyAll className="saveCardTopCopy" title="Copy content" />
        </div>
      </div>
  
  {/* Conditionally render content with different class names */}
  <div className={imageUrl ? "saveCardImageDiv" : "saveCardTextDiv"}>
    {imageUrl ? (
      // If `imageUrl` exists, show the image and make it a clickable link
      <a href={content} target="_blank" rel="noopener noreferrer">
        <img src={imageUrl} alt="Preview" className="thumbnail" />
      </a>
    ) : isValidUrl(content) ? (
      // If no `imageUrl`, display a fallback message for URLs
      <p>{content}</p>
    ) : (
      // Display plain text if not a URL
      <p>{content}</p>
    )}
  </div>
</div>

    
  );
};

export default SaveCard;
