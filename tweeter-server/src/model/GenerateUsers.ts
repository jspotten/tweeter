// Make sure to increase the write capacities for the follow table, follow index, and user table.
import {User} from "tweeter-shared";
import {UserDaoFillTable} from "./dao/users/UserDaoFillTable";
import {FollowsDaoFillTable} from "./dao/follows/FollowsDaoFillTable";

let mainUsername = "@bmarley";
let followername = "@Serpent";
let password = "password";
let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "first";
let lastName = "last";
let mainUser: User = new User(
    'Bob',
    'Marley',
    '@bmarley',
    'https://tweeter-images-jaden.s3.us-west-2.amazonaws.com/images/@bmarley',
)

let numUsers = 10000;
let batchSize = 25;
let aliasList: User[] = Array.from({length: numUsers}, (_, i) => {
    return new User(firstName + i, lastName + i, followername + i, imageUrl)
});
let followsDaoFillTable = new FollowsDaoFillTable();
let userDaoFillTable = new UserDaoFillTable();

console.log('setting followers');
setFollowers(0);
console.log('setting users');
setUsers(0);
userDaoFillTable.increaseFollowersCount(mainUsername, numUsers);

function setFollowers(i: number){
    if(i >= numUsers) return;
    else if(i % 1000 == 0) {
        console.log(i + ' followers');
    }
    let followList = aliasList.slice(i, i + batchSize);
    followsDaoFillTable.createFollows(mainUser, followList)
        .then(()=> setFollowers(i + batchSize))
        .catch((err: any) => console.log('error while setting followers: ' + err));
}
function setUsers(i: number){
    if(i >= numUsers) return;
    else if(i % 1000 == 0) {
        console.log(i + ' users');
    }
    let userList = createUserList(i);
    userDaoFillTable.createUsers(userList, password)
        .then(()=> setUsers(i + batchSize))
        .catch((err: any) => console.log('error while setting users: ' + err));
}


function createUserList(i : number) {
    let users : User[] = [];
    let limit = i + batchSize
    for(let j = i; j < limit; ++j){
        let user = new User(firstName + j, lastName + j, followername + j, imageUrl);
        users.push(user);
    }
    return users;
}