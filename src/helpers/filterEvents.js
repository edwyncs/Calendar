export const filterEvents = (events = [], uid) => {
  return events.filter(event => {
    const isMyEvent = (uid === event.user.uid) || (uid === event.user._id);
    return isMyEvent ? event : null
  });
};