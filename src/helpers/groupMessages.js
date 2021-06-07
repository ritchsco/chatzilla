export const groupMessages = messages => {
  const finalArr = [];

  // 1d array of messages becomes a 2d array of messages
  // this is done to group up the messages by the same sender
  let currentArr = [];
  let currentAuthor = '';
  messages.forEach(m => {
    // If we are on a new author
    // This also works on the initial iteration because the value is initially empty string
    if (m.sender.username !== currentAuthor) {
      if (currentAuthor) {
        finalArr.push([...currentArr]);
      }
      currentArr.splice(0, currentArr.length); // empty the array
      currentArr.push(m);
      currentAuthor = m.sender.username;
    } else {
      currentArr.push(m);
    }
  });

  // We have to call this at the very end as well because
  // once the loop finishes, the first if(){} block will
  // not run and thus the finalArr.push line will not run
  finalArr.push([...currentArr]);

  return finalArr;
};
