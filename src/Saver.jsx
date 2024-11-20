import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SaveCard from './components/saveCard';

const Saver = () => {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState(null);
  const [userImage, setUserImage] = useState('');
  const [cardList, setCardList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  // Toggle the visibility of SaveTextDisplay
  const SaveTextDisplayBord = () => {
    setClick((prevClick) => !prevClick); // Toggle the state
  };

  // Update the text state on input
  const SaveText = (e) => {
    setText(e.target.value);
  };

  // Fetch the user's card list
  const fetchUserCardlist = async (id) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APIURL}/save/savelist`, { userId: id });
      setCardList(response.data.data);
    } catch (error) {
      console.error('Error fetching card list:', error);
    }
  };

  // Submit the saved text and fetch the updated card list
  const SubmitSaveText = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APIURL}/save/createsave`, {
        userID: userId,
        content: text,
      });

      // Hide the text input after submission
      setClick(false);
      setText('');

      // Fetch the updated card list
      fetchUserCardlist(userId);
    } catch (error) {
      console.error('Error saving the text:', error);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('Token not found in localStorage');
          navigate('/');
          return;
        }

        // Fetch user data from the backend
        const response = await axios.post(`${import.meta.env.VITE_APIURL}/users/redirect`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.data === 'user exist') {
          const fetchedUserId = response.data.message.createdUser._id;
          setUserId(fetchedUserId);
          setUserImage(response.data.message.createdUser.image);

          // Fetch card list immediately after setting userId
          fetchUserCardlist(fetchedUserId);

          navigate('/home'); // Redirect to the home page
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);

        if (error.response?.data.data === 'user does not exist') {
          navigate('/');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout function
  const logOut = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`${import.meta.env.VITE_APIURL}/users/signout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('accessToken');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Filter cards based on search term
  const filteredCards = cardList.filter((card) =>
    card.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="navbar">
        <div className="addButton" onClick={SaveTextDisplayBord}>
          Add
        </div>
        <div className="searchBar">
          <input
            className="searchBarInput"
            placeholder="Search"
            value={searchTerm} // Bind search term to state
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input
          />
        </div>
        <div className="googleImageDiv">
          <img className="googleImage" src={userImage} alt="User" onClick={logOut} />
        </div>
      </div>

      {/* Conditional rendering of SaveTextDisplay */}
      {click && (
        <div className="SaveTextDisplay">
          <div className="textDiv">
            <input
              className="textDivInput"
              onChange={SaveText}
              value={text} // Bind input value to state
            />
          </div>
          <div className="saveButton" onClick={SubmitSaveText}>
            Save
          </div>
        </div>
      )}

      {/* Card Display */}
      <div className="CardDisplay">
  {filteredCards && filteredCards.length > 0 ? (
    [...filteredCards].reverse().map((card, index) => (
      <SaveCard
        key={index}
        time={new Date(card.createdAt).toLocaleString()} // Full date and time
        content={card.content}
        imageUrl={card.imageUrl} // Pass the imageUrl to SaveCard
      />
    ))
  ) : (
    <p>No saved cards match your search. Add one using the "Add" button!</p>
  )}
</div>
    </div>
  );
};

export default Saver;
