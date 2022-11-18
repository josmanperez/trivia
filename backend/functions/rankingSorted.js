exports = async function() {
  
  const dbName = context.values.get('db_name');
  const ranking = context.services.get('mongodb-atlas').db(dbName).collection("Ranking");
  
  const agg = [
    {
      '$sort': {
        'winRate': -1, 
        'totalGames': -1,
        'totalTime': 1, 
        'useremail': 1
      }
    }
  ];
  
  try {
    const results = await ranking.aggregate(agg).toArray();
    return results;
  } catch (error) {
    console.error(error.toString());
  }
};