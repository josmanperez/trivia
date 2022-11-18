exports = async function(changeEvent) {
  
  const dbName = context.values.get('db_name');
  const users = context.services.get('mongodb-atlas').db(dbName).collection("User");
  const ranking = context.services.get('mongodb-atlas').db(dbName).collection("Ranking");
  
  pipeline = [
    {"$match" : {
		  "_id": changeEvent.documentKey._id}
	  },
    {"$project" : {
	    "winRatio": { "$divide": ["$individualWonGames", { "$size" : "$games"}]},
	    "totalTimeElapsed" : {"$sum" : "$games.timeElapsed"},
	    "totalGames" : { "$size" : "$games"}
    }
  }];
  
  categoryPipeline = [
  {
    '$match': {
      '_id': changeEvent.documentKey._id}
  }, 
  {'$unwind': {
    'path': '$games'}
  }, 
  {'$group': {
    '_id': '$games.category', 
    'count': {
      '$sum': 1 }
    }
  }];
  
  //console.log(JSON.stringify(pipeline));
  
  try {
    const result = await users.aggregate(pipeline).toArray();
    console.log(JSON.stringify(result));
    if (result.length == 1) {
      const category = await users.aggregate(categoryPipeline).toArray();
      console.log(JSON.stringify(category));
      const doc = await ranking.updateOne(
        {user: changeEvent.documentKey._id },
        {
          $set: {
            totalTime: result[0].totalTimeElapsed,
            totalGames: result[0].totalGames,
            winRate: result[0].winRatio,
            categorySummary: category
          }
        },
        {
         $upsert : true
       });  
       console.log(JSON.stringify(doc));
    } else {
      console.error("No elements returned");
    }

  } catch (error) {
    console.error(error.toString());
  }
  
  
};
