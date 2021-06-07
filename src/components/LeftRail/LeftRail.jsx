import { useChat } from 'context';
import { useResolved } from 'hooks';
import { Loader } from 'semantic-ui-react';
import { ChatList, RailHeader } from 'components';

export const LeftRail = () => {
  const { myChats, createChatClick } = useChat();
  const chatsResolved = useResolved(myChats);

  // when chats resolves display create a chat, chat lists,
  // else if the user is not a membber of any chats display this
  //  display loading while these options resolve
  return (
    <div className="left-rail">
      <RailHeader />
      {chatsResolved ? (
        <>
          {!!myChats.length ? (
            <div className="chat-list-container">
              <ChatList />
            </div>
          ) : (
            <div className="chat-list-container no-chats-yet">
              <h3>No Chats Found</h3>
            </div>
          )}
          <button className="create-chat-button" onClick={createChatClick}>
            Create a Chat
          </button>
        </>
      ) : (
        <div className="chats-loading">
          <Loader active size="huge" />
        </div>
      )}
    </div>
  );
};
