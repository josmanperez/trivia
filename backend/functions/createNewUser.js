exports = async function createNewUser({user}) {
  
  console.log(JSON.stringify(user));
  const dbName = context.values.get('db_name');
  const users = context.services.get('mongodb-atlas').db(dbName).collection("User");
  const email = user.data.email == undefined ? "" : user.data.email;
  const name = user.data.name == undefined ? "" : user.data.name;
  console.log(`id: ${user.id} name: ${name}`);
  
  const ranking = context.services.get('mongodb-atlas').db(dbName).collection("Ranking");
  
  try {
    await ranking.insertOne({
      user: user.id,
      username: name,
      useremail: email,
      totalTime: 0,
      totalGames: 0,
      winRate: 0.0
    });
  } catch(error) {
    console.error(error.toString());
    return;
  }
  
  return users.insertOne({
    _id: user.id,
    user: user.id,
    email: email,
    name: name,
    individualWonGames: 0,
    wonGames: 0,
    providerType: user.identities[0].provider_type
  });
};