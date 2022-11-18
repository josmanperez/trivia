exports = async function(id) {
  
  const dbName = context.values.get('db_name');
  const user = context.services.get('mongodb-atlas').db(dbName).collection("User");
  
  const pipeline = [
  {
    '$match': {
      '_id': id
    }
  }, {
    '$project': {
      'games': 1, 
      '_id': 0,
      'individualWonGames': 1,
      'total': {
            '$size': "$games"
          }
      }
  }, {
    '$unwind': {
      'path': '$games'
    }
  }, {
    '$sort': {
      'games.date': -1
    }
  }, {
    '$limit': 1
  }];
  
  try {
    const result = await user.aggregate(pipeline).toArray();
    if (result.length > 0) {
      return result[0];
    } else {
      return ;
    }
  } catch(error) {
    console.error(error.toString());
    return "{}";
  }
};