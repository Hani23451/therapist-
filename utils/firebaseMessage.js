const fireBaseMessage = (title, body, data, topic) => {
  return {
    notification: {
      title,
      body,
      imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKg1cDiIlTJXwUBjgqvzlOMSwHBYsFesGuA&s",
    },
    data,
    topic,
  };
};
 
module.exports =  fireBaseMessage ;