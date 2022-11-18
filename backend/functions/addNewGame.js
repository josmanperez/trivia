exports = async function(game) {
  
  console.log(JSON.stringify(game));

  const currentUser = context.user;
  const dbName = context.values.get('db_name');
  const users = context.services.get('mongodb-atlas').db(dbName).collection("User");
  
  try {
    if (game.asserts > game.fails) {
       return await users.updateOne(
         {_id: currentUser.id},
         {$addToSet: {
           games: game
         }, $inc: { individualWonGames: 1 }});
    } else {
      return await users.updateOne(
         {_id: currentUser.id},
         {$addToSet: {
           games: game
         }});
    }
   
  } catch (error) {
    console.error(error.toString());
    return {error: error.toString()};
  }
};