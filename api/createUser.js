import axios from 'axios';

const createUser = async (req, res) => {
  const { userId, userName } = req.body;

  // send the post to chatengine to create the user
  // user is created with the same UN in fb and the 
  // fb UID is used to create the user in chatengine to link them
  axios
    .post('https://api.chatengine.io/projects/people/',
      { username: userName, secret: userId },
      { headers: { 'Private-Key': process.env.chat_engine_private_key } },
    )
    .then(apiRes => {
      res.json({
        body: apiRes.data,
        error: null,
      });
    })
    .catch(() => {
      res.json({
        body: null,
        error: 'There was an error creating the user',
      });
    });
};

export default createUser;