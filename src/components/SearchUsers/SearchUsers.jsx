import { useChat } from 'context';
import { Search } from 'semantic-ui-react';
import { useEffect, useRef, useState } from 'react';
import { addPerson, getOtherPeople } from 'react-chat-engine';
import { useDebounce } from 'hooks';

export const SearchUsers = ({ visible, closeFn }) => {
  let searchRef = useRef();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // null -> not searching for results
  // [] -> No results
  // [...] -> Results
  const [searchResults, setSearchResults] = useState(null);

  // focus is ref to input (when search bar is visible mouse in the search bar)
  useEffect(() => {
    if (visible && searchRef) {
      searchRef.focus();
    }
  }, [visible]);

  const { myChats, setMyChats, chatConfig, selectedChat, setSelectedChat } =
    useChat();

  // filter out chats that are not selected
  // updated chats is currently selected chat with users in that chat
  // appends selected user to that new chat and updates the chat
  // closes search after this has been completed
  const selectUser = username => {
    addPerson(chatConfig, selectedChat.id, username, () => {
      const filteredChats = myChats.filter(c => c.id !== selectedChat.id);
      const updatedChat = {
        ...selectedChat,
        people: [...selectedChat.people, { person: { username } }],
      };

      setSelectedChat(updatedChat);
      setMyChats([...filteredChats, updatedChat]);
      closeFn();
    });
  };

  // search for all the un for users that can be added to the selected chat
  // filter the search for the un that matches what was entered
  // if search term doesnt exist dont display results
  // search term is only ever called after the debounce delay
  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      getOtherPeople(chatConfig, selectedChat.id, (chatId, data) => {
        const userNames = Object.keys(data)
          .map(key => data[key].username)
          .filter(u =>
            u.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
          );
        setSearchResults(userNames.map(u => ({ title: u })));
        setLoading(false);
      });
    } else {
      setSearchResults(null);
    }
  }, [debouncedSearchTerm, chatConfig, selectedChat]);

  // hide search bar if its not visible
  // search results open if results exist and not loading
  // if result exists select user clicked on
  return (
    <div
      className="user-search"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <Search
        fluid
        onBlur={closeFn}
        loading={loading}
        value={searchTerm}
        placeholder="Search Users"
        open={!!searchResults && !loading}
        input={{ ref: r => (searchRef = r) }}
        onSearchChange={e => setSearchTerm(e.target.value)}
        results={searchResults}
        onResultSelect={(e, data) => {
          if (data.result?.title) {
            selectUser(data.result.title);
          }
        }}
      />
    </div>
  );
};
