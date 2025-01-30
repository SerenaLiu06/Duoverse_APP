'use strict';
const db = uniCloud.database()
const expDB = db.collection('exp-points')
const ptlist = [0, 10, 10, 30, 50]
const hilevelpt = 100
exports.main = async (event, context) => {

	let user_id = event.user_id;
	let expdata = await expDB.where({
		user_id: user_id
	}).get();
	let level = 1;
	let newpoints = event.points;
	let expleft = 0;
	if(expdata.affectedDocs == 0){
		for(var i = 1; newpoints >= ptlist[i] && i < ptlist.length; i++){
			newpoints -= ptlist[i];
			level += 1;
		}
		while(newpoints >= hilevelpt){
			newpoints -= hilevelpt;
			level += 1
		}
		await expDB.add({
			"user_id": user_id,
			"balance": event.points,
			"level": level,
			"create_date": Date.now(),
			"exp_left": newpoints
		})
		// return 1
	}
	else{
		let balance = expdata.data[0].balance + newpoints;
		newpoints = balance
		for(var i = 1; newpoints >= ptlist[i] && i < ptlist.length; i++){
			newpoints -= ptlist[i];
			level += 1;
		}
		while(newpoints >= hilevelpt){
			newpoints -= hilevelpt;
			level += 1
		}
		await expDB.where({
			user_id: user_id,
		}).update({
			"balance": balance,
			"level": level,
			"exp_left": newpoints
		})
		// return expdata.data[0]._id
	}
	
};
